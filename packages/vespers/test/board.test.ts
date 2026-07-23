import { describe, it, expect } from "vitest";
import { Board, BoardSchema, renderBoardMd, sortBoardItems } from "../src/board";

const prItem = (state: Board["items"][number]["state"], number: number): Extract<Board["items"][number], { kind: "pr" }> => ({
  kind: "pr", artifact_uri: `pr:o/r#${number}`, repo: "o/r", number, title: `PR ${number}`,
  url: `https://github.com/o/r/pull/${number}`, state,
  reason: "test", new_items: [],
});

const issueItem = (state: Board["items"][number]["state"], identifier: string): Extract<Board["items"][number], { kind: "issue" }> => ({
  kind: "issue", artifact_uri: `issue:art/${identifier.toLowerCase()}`, team: "ART", identifier,
  title: `Issue ${identifier}`, url: `https://linear.app/team/issue/${identifier}`, state,
  reason: "test", new_items: [],
});

const board: Board = {
  generated_at: "2026-07-17T08:00:00Z",
  tick_status: "ok",
  window: { since: "2026-07-14T08:00:00Z", until: "2026-07-17T08:00:00Z" },
  freshness: [{ source: "lectio", last_advanced_at: "2026-07-17T06:00:00Z" }],
  degradations: [],
  items: [prItem("resolved", 1), prItem("needs_you", 2), prItem("opened", 3), prItem("active", 4)],
};

describe("BoardSchema", () => {
  it("accepts the spec board shape", () => {
    expect(BoardSchema.parse(board)).toBeTruthy();
  });
  it("accepts a mixed pr/issue items array", () => {
    const mixed = { ...board, items: [prItem("needs_you", 1), issueItem("needs_you", "ART-1")] };
    expect(BoardSchema.parse(mixed)).toBeTruthy();
  });
  it("rejects unknown tick_status", () => {
    expect(() => BoardSchema.parse({ ...board, tick_status: "meh" })).toThrow();
  });
  it("rejects items with unknown state", () => {
    expect(() => BoardSchema.parse({ ...board, items: [{ ...prItem("opened", 1), state: "blocked" }] })).toThrow();
  });
  it("rejects an issue item missing team/identifier", () => {
    const { team: _team, identifier: _identifier, ...bad } = issueItem("needs_you", "ART-1");
    expect(() => BoardSchema.parse({ ...board, items: [bad] })).toThrow();
  });
});

describe("sortBoardItems", () => {
  it("enforces needs_you, active, opened, resolved across mixed kinds", () => {
    const mixed = [prItem("resolved", 1), issueItem("needs_you", "ART-1"), prItem("opened", 3), prItem("active", 4)];
    expect(sortBoardItems(mixed).map((i) => i.state)).toEqual([
      "needs_you", "active", "opened", "resolved",
    ]);
  });
});

describe("renderBoardMd", () => {
  it("renders resolved as a footnote, not a full entry", () => {
    const md = renderBoardMd({ ...board, items: sortBoardItems(board.items) });
    expect(md).toContain("## [needs_you] o/r#2");
    expect(md).not.toContain("## [resolved]");
    expect(md).toContain("Resolved: o/r#1");
  });
  it("renders an issue entry as team/identifier, not repo#number", () => {
    const md = renderBoardMd({ ...board, items: [issueItem("needs_you", "ART-9")] });
    expect(md).toContain("## [needs_you] ART/ART-9");
    expect(md).toContain("https://linear.app/team/issue/ART-9");
  });
  it("renders a resolved issue in the footnote by team/identifier", () => {
    const md = renderBoardMd({ ...board, items: [issueItem("resolved", "ART-9")] });
    expect(md).toContain("Resolved: ART/ART-9");
  });
  it("renders an all-clear line when nothing is active", () => {
    const md = renderBoardMd({ ...board, tick_status: "all_clear", items: [prItem("resolved", 1)] });
    expect(md).toContain("All clear");
  });
  it("title is generic, not PR-specific", () => {
    expect(renderBoardMd(board)).toContain("# Board");
    expect(renderBoardMd(board)).not.toContain("# PR Board");
  });
});

const snapshot = {
  kind: "weather",
  label: "Weather — Austin, TX",
  value: "72°F, clear",
  detail: "feels like 75°F, humidity 40%",
  as_of: "2026-07-18T15:04:00Z",
};

describe("board schema: snapshots + material_hash", () => {
  it("renderBoardMd renders the Snapshots section after Freshness, in the specified format", () => {
    const md = renderBoardMd({ ...board, snapshots: [snapshot] });
    expect(md).toContain("## Snapshots");
    expect(md).toContain(
      "- Weather — Austin, TX: 72°F, clear (feels like 75°F, humidity 40%) — as of 2026-07-18T15:04:00Z",
    );
    expect(md.indexOf("## Freshness")).toBeLessThan(md.indexOf("## Snapshots"));
    expect(md.indexOf("## Snapshots")).toBeLessThan(md.indexOf("## [needs_you]"));
  });

  it("omits the detail parenthetical when detail is absent", () => {
    const { detail: _drop, ...noDetail } = snapshot;
    const md = renderBoardMd({ ...board, snapshots: [noDetail] });
    expect(md).toContain("- Weather — Austin, TX: 72°F, clear — as of 2026-07-18T15:04:00Z");
  });

  it("renders no Snapshots section when snapshots is absent or empty", () => {
    expect(renderBoardMd(board)).not.toContain("## Snapshots");
    expect(renderBoardMd({ ...board, snapshots: [] })).not.toContain("## Snapshots");
  });
});
