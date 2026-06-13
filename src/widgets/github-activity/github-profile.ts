const GITHUB_PROFILE_HOSTS = new Set(["github.com", "www.github.com"]);
const RESERVED_GITHUB_PATHS = new Set([
  "about",
  "apps",
  "collections",
  "customer-stories",
  "events",
  "explore",
  "features",
  "login",
  "marketplace",
  "new",
  "notifications",
  "orgs",
  "pricing",
  "pulls",
  "search",
  "settings",
  "signup",
  "sponsors",
  "topics",
  "trending",
]);
const GITHUB_USERNAME_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const DAILY_GREEN_BASE_URL = "https://www.dailygreen.xyz";

export function parseGithubUsername(input: string) {
  const value = input.trim();

  if (!value) {
    return "";
  }

  const withoutHandlePrefix = value.startsWith("@") ? value.slice(1).trim() : value;
  const username = parseGithubProfileUrl(withoutHandlePrefix) || parseGithubHandle(withoutHandlePrefix);

  return isValidGithubUsername(username) ? username : "";
}

export function buildGithubActivityImageUrl(input: string) {
  const username = parseGithubUsername(input);

  return username ? `${DAILY_GREEN_BASE_URL}/${encodeURIComponent(username)}` : "";
}

function parseGithubProfileUrl(input: string) {
  const maybeUrl = input.match(/^https?:\/\//i) ? input : input.match(/^(?:www\.)?github\.com\//i) ? `https://${input}` : "";

  if (!maybeUrl) {
    return "";
  }

  try {
    const url = new URL(maybeUrl);

    if (!GITHUB_PROFILE_HOSTS.has(url.hostname.toLowerCase())) {
      return "";
    }

    const pathParts = url.pathname.split("/").filter(Boolean);

    if (pathParts.length !== 1) {
      return "";
    }

    return pathParts[0] ?? "";
  } catch {
    return "";
  }
}

function parseGithubHandle(input: string) {
  return /[/?#]/.test(input) ? "" : input;
}

function isValidGithubUsername(username: string) {
  const normalized = username.trim();

  return GITHUB_USERNAME_PATTERN.test(normalized) && !RESERVED_GITHUB_PATHS.has(normalized.toLowerCase());
}
