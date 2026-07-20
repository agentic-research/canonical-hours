import { z } from "zod";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  ClassificationSchema,
  LIFECYCLE_SORT_ORDER,
  LifecycleStateSchema,
} from "../sources/source";
import { SnapshotValueSchema } from "../sources/snapshot";

export const BoardItemSchema = z.object({
  type: z.string(),
  author: z.string(),
  path: z.string().optional(),
  preview: z.string(),
  at: z.string(),
  uri: z.string().optional(),
  classification: ClassificationSchema,
});

export const BoardPrSchema = z.object({
  artifact_uri: z.string(),
  repo: z.string(),
  number: z.number().int(),
  title: z.string(),
  url: z.string(),
  state: LifecycleStateSchema,
  reason: z.string(),
  new_items: z.array(BoardItemSchema),
  summary: z.string().optional(), // Haiku's thread summary; absent on all-clear
});

export const BoardSchema = z.object({
  generated_at: z.string(),
  tick_status: z.enum(["ok", "degraded", "all_clear"]),
  window: z.object({ since: z.string(), until: z.string() }),
  freshness: z.array(z.object({ source: z.string(), last_advanced_at: z.string().nullable() })),
  degradations: z.array(z.object({ source: z.string(), error: z.string(), since: z.string() })),
  prs: z.array(BoardPrSchema),
  // Both optional deliberately: (1) migration — readBoard() returns null on ANY
  // parse failure; required fields would make the first post-deploy tick discard
  // degradations.since carry-forward. (2) model-input hygiene — tools/board.ts
  // uses BoardSchema as inputSchema; the model must never be required to
  // fabricate either. Both are runtime-authoritative, stamped by runTick.
  snapshots: z.array(SnapshotValueSchema).optional(),
  material_hash: z.string().optional(),
});
export type Board = z.infer<typeof BoardSchema>;

/** The board contract's sort order — enforced, not a convention. */
export function sortBoardPrs(prs: Board["prs"]): Board["prs"] {
  return [...prs].sort(
    (a, b) =>
      LIFECYCLE_SORT_ORDER[a.state] - LIFECYCLE_SORT_ORDER[b.state] ||
      a.artifact_uri.localeCompare(b.artifact_uri),
  );
}

export function renderBoardMd(board: Board): string {
  const lines: string[] = [];
  lines.push("# PR Board");
  lines.push(`Generated: ${board.generated_at} — status: ${board.tick_status}`);
  lines.push(`Window: ${board.window.since} → ${board.window.until}`);
  if (board.degradations.length > 0) {
    lines.push("", "## Degradations");
    for (const d of board.degradations) lines.push(`- ${d.source}: ${d.error} (since ${d.since})`);
  }
  lines.push("", "## Freshness");
  for (const f of board.freshness) lines.push(`- ${f.source}: ${f.last_advanced_at ?? "unknown"}`);

  if (board.snapshots && board.snapshots.length > 0) {
    lines.push("", "## Snapshots");
    for (const s of board.snapshots) {
      lines.push(`- ${s.label}: ${s.value}${s.detail ? ` (${s.detail})` : ""} — as of ${s.as_of}`);
    }
  }

  const active = board.prs.filter((p) => p.state !== "resolved");
  const resolved = board.prs.filter((p) => p.state === "resolved");
  if (active.length === 0) lines.push("", "All clear — nothing needs you.");
  for (const pr of active) {
    lines.push("", `## [${pr.state}] ${pr.repo}#${pr.number} — ${pr.title}`, pr.url, `Reason: ${pr.reason}`);
    if (pr.summary) lines.push(`Summary: ${pr.summary}`);
    for (const item of pr.new_items) {
      lines.push(`- ${item.at} ${item.author} (${item.type}): ${item.preview}`);
    }
  }
  if (resolved.length > 0) {
    lines.push("", "---", `Resolved: ${resolved.map((p) => `${p.repo}#${p.number}`).join(", ")}`);
  }
  return lines.join("\n") + "\n";
}

export function boardDir(): string {
  return process.env.BOARD_DIR ?? "board";
}

/** Validate + write board.json and board.md atomically (write-temp-then-rename): a poll never sees a half-written board. */
export async function writeBoardAtomic(board: Board, dir: string = boardDir()): Promise<void> {
  const validated = BoardSchema.parse({ ...board, prs: sortBoardPrs(board.prs) });
  await mkdir(dir, { recursive: true });
  const jsonTmp = join(dir, ".board.json.tmp");
  const mdTmp = join(dir, ".board.md.tmp");
  await writeFile(jsonTmp, JSON.stringify(validated, null, 2), "utf8");
  await rename(jsonTmp, join(dir, "board.json"));
  await writeFile(mdTmp, renderBoardMd(validated), "utf8");
  await rename(mdTmp, join(dir, "board.md"));
}

export async function readBoard(dir: string = boardDir()): Promise<Board | null> {
  try {
    const raw = await readFile(join(dir, "board.json"), "utf8");
    return BoardSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}
