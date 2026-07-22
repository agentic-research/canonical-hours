import { z } from "zod";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  ClassificationSchema,
  LIFECYCLE_SORT_ORDER,
  LifecycleStateSchema,
} from "./sources/source";
import { SnapshotValueSchema } from "@canonical-hours/core";

/** One activity entry inside a board item's `new_items` — renamed from the
 * old top-level `BoardItemSchema` to free that name for the per-artifact
 * board entry below (the real generalization this schema needed). */
export const BoardActivitySchema = z.object({
  type: z.string(),
  author: z.string(),
  path: z.string().optional(),
  preview: z.string(),
  at: z.string(),
  uri: z.string().optional(),
  classification: ClassificationSchema,
});

const BoardPrSchema = z.object({
  kind: z.literal("pr"),
  artifact_uri: z.string(),
  repo: z.string(),
  number: z.number().int(),
  title: z.string(),
  url: z.string(),
  state: LifecycleStateSchema,
  reason: z.string(),
  new_items: z.array(BoardActivitySchema),
  summary: z.string().optional(), // Haiku's thread summary; absent on all-clear
  merge_ready: z.boolean().optional(), // absent for non-GitHub artifacts or when unknown
});

const BoardIssueSchema = z.object({
  kind: z.literal("issue"),
  artifact_uri: z.string(),
  team: z.string(),
  identifier: z.string(),
  title: z.string(),
  url: z.string(),
  state: LifecycleStateSchema,
  reason: z.string(),
  new_items: z.array(BoardActivitySchema),
  summary: z.string().optional(),
});

/** A board entry — a PR or a Linear issue, same generalization as ArtifactSchema (source.ts). */
export const BoardItemSchema = z.discriminatedUnion("kind", [BoardPrSchema, BoardIssueSchema]);
export type BoardItem = z.infer<typeof BoardItemSchema>;

export const BoardSchema = z.object({
  generated_at: z.string(),
  tick_status: z.enum(["ok", "degraded", "all_clear"]),
  window: z.object({ since: z.string(), until: z.string() }),
  freshness: z.array(z.object({ source: z.string(), last_advanced_at: z.string().nullable() })),
  degradations: z.array(z.object({ source: z.string(), error: z.string(), since: z.string() })),
  items: z.array(BoardItemSchema),
  snapshots: z.array(SnapshotValueSchema).optional(),
  material_hash: z.string().optional(),
});
export type Board = z.infer<typeof BoardSchema>;

/** The board contract's sort order — enforced, not a convention. */
export function sortBoardItems(items: Board["items"]): Board["items"] {
  return [...items].sort(
    (a, b) =>
      LIFECYCLE_SORT_ORDER[a.state] - LIFECYCLE_SORT_ORDER[b.state] ||
      a.artifact_uri.localeCompare(b.artifact_uri),
  );
}

function itemLabel(item: Board["items"][number]): string {
  return item.kind === "pr" ? `${item.repo}#${item.number}` : `${item.team}/${item.identifier}`;
}

export function renderBoardMd(board: Board): string {
  const lines: string[] = [];
  lines.push("# Board");
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

  const active = board.items.filter((i) => i.state !== "resolved");
  const resolved = board.items.filter((i) => i.state === "resolved");
  if (active.length === 0) lines.push("", "All clear — nothing needs you.");
  for (const item of active) {
    lines.push("", `## [${item.state}] ${itemLabel(item)} — ${item.title}`, item.url, `Reason: ${item.reason}`);
    if (item.summary) lines.push(`Summary: ${item.summary}`);
    for (const activity of item.new_items) {
      lines.push(`- ${activity.at} ${activity.author} (${activity.type}): ${activity.preview}`);
    }
  }
  if (resolved.length > 0) {
    lines.push("", "---", `Resolved: ${resolved.map(itemLabel).join(", ")}`);
  }
  return lines.join("\n") + "\n";
}

export function boardDir(): string {
  return process.env.BOARD_DIR ?? "board";
}

/** Validate + write board.json and board.md atomically (write-temp-then-rename): a poll never sees a half-written board. */
export async function writeBoardAtomic(board: Board, dir: string = boardDir()): Promise<void> {
  const validated = BoardSchema.parse({ ...board, items: sortBoardItems(board.items) });
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
