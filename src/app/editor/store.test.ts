import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createEditorStore } from "./store";
import type { PageConfig } from "@/lib/page-config/types";

const draftKey = "mellow-grid:username:draft";

describe("editor draft storage", () => {
  beforeEach(() => {
    const sessionStorage = createStorageMock();
    const localStorage = createStorageMock();

    vi.stubGlobal("window", { sessionStorage, localStorage });
    vi.stubGlobal("sessionStorage", sessionStorage);
    vi.stubGlobal("localStorage", localStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("saves drafts only for the current browser session", async () => {
    const store = createEditorStore(createConfig({ title: "JSON title" }));

    await store.getState().saveDraft();

    expect(sessionStorage.getItem(draftKey)).toContain('"title": "JSON title"');
    expect(localStorage.getItem(draftKey)).toBeNull();
  });

  it("loads the current session draft instead of a stale persistent draft", () => {
    localStorage.setItem(draftKey, JSON.stringify(createConfig({ title: "Stale localStorage title" })));
    sessionStorage.setItem(draftKey, JSON.stringify(createConfig({ title: "Session title" })));
    const store = createEditorStore(createConfig({ title: "JSON title" }));

    store.getState().loadLocalDraft();

    expect(store.getState().config.title).toBe("Session title");
    expect(store.getState().status).toBe("Session draft loaded");
  });

  it("keeps the JSON-backed default when only an old localStorage draft exists", () => {
    localStorage.setItem(draftKey, JSON.stringify(createConfig({ title: "Stale localStorage title" })));
    const store = createEditorStore(createConfig({ title: "JSON title" }));

    store.getState().loadLocalDraft();

    expect(store.getState().config.title).toBe("JSON title");
    expect(store.getState().status).toBe("Ready");
  });
});

function createConfig(overrides: Partial<PageConfig> = {}): PageConfig {
  return {
    username: "username",
    title: "JSON title",
    description: "Description",
    profile: {
      name: "Username",
      bio: "Short bio",
      location: "Location",
      contacts: [],
    },
    theme: {
      background: "#ffffff",
      foreground: "#000000",
      card: "#121313",
      accent: "#ade0ff",
      radius: "round",
      shadow: "soft",
    },
    layout: [],
    widgets: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function createStorageMock(): Storage {
  const items = new Map<string, string>();

  return {
    get length() {
      return items.size;
    },
    clear() {
      items.clear();
    },
    getItem(key: string) {
      return items.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(items.keys())[index] ?? null;
    },
    removeItem(key: string) {
      items.delete(key);
    },
    setItem(key: string, value: string) {
      items.set(key, value);
    },
  };
}
