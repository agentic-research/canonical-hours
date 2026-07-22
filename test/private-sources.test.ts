import { describe, it, expect, vi, afterEach } from "vitest";
import { loadPrivateSources } from "../agent/lib/private-sources";
import type { Source } from "@vespers/core";

describe("loadPrivateSources", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns [] with no logging when path is undefined (absence is a valid state)", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const importModule = vi.fn();
    const result = await loadPrivateSources(undefined, importModule);
    expect(result).toEqual([]);
    expect(importModule).not.toHaveBeenCalled();
    expect(errSpy).not.toHaveBeenCalled();
  });

  it("loads and returns the module's sources array when the path resolves", async () => {
    const fakeSource = { name: "interviews" } as unknown as Source;
    const importModule = vi.fn().mockResolvedValue({ sources: [fakeSource] });
    const result = await loadPrivateSources("/some/path/dist/index.js", importModule);
    expect(result).toEqual([fakeSource]);
    expect(importModule).toHaveBeenCalledWith(expect.stringContaining("file://"));
  });

  it("logs and returns [] (never throws) when the import itself fails", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const importModule = vi.fn().mockRejectedValue(new Error("module not found"));
    const result = await loadPrivateSources("/nonexistent/dist/index.js", importModule);
    expect(result).toEqual([]);
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining("failed to load"));
  });

  it("logs and returns [] when the module has no sources array export", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const importModule = vi.fn().mockResolvedValue({ notSources: true });
    const result = await loadPrivateSources("/some/path/dist/index.js", importModule);
    expect(result).toEqual([]);
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining("no `sources` array export"));
  });
});
