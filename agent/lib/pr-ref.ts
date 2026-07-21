export interface PrRef {
  owner: string;
  repo: string;
  number: number;
}

const URL_RE = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)\/?$/;
const SHORT_RE = /^([^/]+)\/([^/]+)#(\d+)$/;

/** Accepts "owner/repo#123" or a github.com PR URL — the two formats the new MCP action tools take as input. */
export function parsePrRef(pr: string): PrRef {
  const trimmed = pr.trim();
  const urlMatch = URL_RE.exec(trimmed);
  if (urlMatch) {
    return { owner: urlMatch[1], repo: urlMatch[2], number: Number(urlMatch[3]) };
  }
  const shortMatch = SHORT_RE.exec(trimmed);
  if (shortMatch) {
    return { owner: shortMatch[1], repo: shortMatch[2], number: Number(shortMatch[3]) };
  }
  throw new Error(`invalid PR reference: "${pr}" (expected "owner/repo#123" or a github.com PR URL)`);
}
