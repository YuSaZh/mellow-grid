import { describe, expect, it } from "vitest";
import { buildGithubActivityImageUrl, parseGithubUsername } from "./github-profile";

describe("GitHub profile utilities", () => {
  it("extracts a GitHub username from profile links and handles", () => {
    expect(parseGithubUsername("https://github.com/octocat")).toBe("octocat");
    expect(parseGithubUsername("https://github.com/octocat/")).toBe("octocat");
    expect(parseGithubUsername("github.com/octocat?tab=overview")).toBe("octocat");
    expect(parseGithubUsername("@octocat")).toBe("octocat");
    expect(parseGithubUsername("octocat")).toBe("octocat");
  });

  it("rejects non-profile GitHub URLs and invalid handles", () => {
    expect(parseGithubUsername("https://github.com/octocat/Hello-World")).toBe("");
    expect(parseGithubUsername("https://github.com/topics/react")).toBe("");
    expect(parseGithubUsername("bad name")).toBe("");
    expect(parseGithubUsername("-bad")).toBe("");
  });

  it("builds a DailyGreen SVG URL from a GitHub profile link", () => {
    expect(buildGithubActivityImageUrl("https://github.com/octocat")).toBe("https://www.dailygreen.xyz/octocat");
  });
});
