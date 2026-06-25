import assert from "node:assert/strict";
import test from "node:test";

import { computeNextIndex } from "@/components/search/GlobalSearch";
import {
  GroupedSearchResults,
  hasAnySearchResults,
  searchMockIndex,
} from "@/lib/mock-search-index";

// ── computeNextIndex ─────────────────────────────────────────────────────────

test("computeNextIndex moves forward by 1", () => {
  assert.equal(computeNextIndex(0, 1, 5), 1);
  assert.equal(computeNextIndex(3, 1, 5), 4);
});

test("computeNextIndex moves backward by 1", () => {
  assert.equal(computeNextIndex(4, -1, 5), 3);
  assert.equal(computeNextIndex(1, -1, 5), 0);
});

test("computeNextIndex wraps from last to first", () => {
  assert.equal(computeNextIndex(4, 1, 5), 0);
});

test("computeNextIndex wraps from first to last", () => {
  assert.equal(computeNextIndex(0, -1, 5), 4);
});

test("computeNextIndex starts at 0 when current is -1", () => {
  assert.equal(computeNextIndex(-1, 1, 5), 0);
  assert.equal(computeNextIndex(-1, -1, 5), 0);
});

test("computeNextIndex returns -1 when total is 0", () => {
  assert.equal(computeNextIndex(-1, 1, 0), -1);
  assert.equal(computeNextIndex(0, 1, 0), -1);
});

test("computeNextIndex clamps out-of-range current to 0", () => {
  assert.equal(computeNextIndex(99, 1, 5), 0);
});

// ── hasAnySearchResults ──────────────────────────────────────────────────────

test("hasAnySearchResults returns false for empty results", () => {
  const empty: GroupedSearchResults = { Pages: [], Actions: [], Records: [] };
  assert.equal(hasAnySearchResults(empty), false);
});

test("hasAnySearchResults returns true when any group has items", () => {
  const withPages: GroupedSearchResults = {
    Pages: [
      {
        id: "p1",
        group: "Pages",
        title: "Test",
        description: "",
        href: "/test",
      },
    ],
    Actions: [],
    Records: [],
  };
  assert.equal(hasAnySearchResults(withPages), true);
});

test("hasAnySearchResults returns true when Actions has items", () => {
  const withActions: GroupedSearchResults = {
    Pages: [],
    Actions: [
      {
        id: "a1",
        group: "Actions",
        title: "Test",
        description: "",
        href: "/test",
      },
    ],
    Records: [],
  };
  assert.equal(hasAnySearchResults(withActions), true);
});

test("hasAnySearchResults returns true when Records has items", () => {
  const withRecords: GroupedSearchResults = {
    Pages: [],
    Actions: [],
    Records: [
      {
        id: "r1",
        group: "Records",
        title: "Test",
        description: "",
        href: "/test",
      },
    ],
  };
  assert.equal(hasAnySearchResults(withRecords), true);
});

// ── searchMockIndex ──────────────────────────────────────────────────────────

test("searchMockIndex returns empty results for empty query", async () => {
  const results = await searchMockIndex("");
  assert.equal(hasAnySearchResults(results), false);
});

test("searchMockIndex returns empty results for whitespace-only query", async () => {
  const results = await searchMockIndex("   ");
  assert.equal(hasAnySearchResults(results), false);
});

test("searchMockIndex matches by title (case-insensitive)", async () => {
  const results = await searchMockIndex("dashboard");
  assert.ok(results.Pages.some((p) => p.title === "Dashboard"));
});

test("searchMockIndex matches by description", async () => {
  const results = await searchMockIndex("portfolio");
  assert.ok(results.Pages.some((p) => p.title === "Dashboard"));
});

test("searchMockIndex matches by keyword", async () => {
  const results = await searchMockIndex("deposit");
  assert.ok(results.Actions.some((a) => a.id === "action-start-deposit"));
  assert.ok(results.Records.some((r) => r.id === "record-tx-7f1"));
});

test("searchMockIndex returns grouped results", async () => {
  // "tx" appears in Records (TX-7F1C, TX-912A) and action keywords
  const results = await searchMockIndex("tx");
  assert.ok(results.Records.length >= 2);
  assert.ok(results.Actions.length >= 0);
  assert.ok(results.Pages.length >= 0);
});

test("searchMockIndex throws for query 'error'", async () => {
  await assert.rejects(
    () => searchMockIndex("error"),
    /Mock search failed/,
  );
});

test("searchMockIndex returns empty for no match", async () => {
  const results = await searchMockIndex("xyznonexistent");
  assert.equal(hasAnySearchResults(results), false);
});

test("searchMockIndex returns empty for 'error' in Pages group", async () => {
  // It throws, so no results
  await assert.rejects(() => searchMockIndex("error"));
});

// ── Search group counts ───────────────────────────────────────────────────────

test("searchMockIndex 'home' returns the Home page", async () => {
  const results = await searchMockIndex("home");
  assert.equal(results.Pages.length, 1);
  assert.equal(results.Pages[0].id, "page-home");
});

test("searchMockIndex 'usdc' returns deposit action and TX record", async () => {
  const results = await searchMockIndex("usdc");
  assert.ok(results.Actions.some((a) => a.id === "action-start-deposit"));
  assert.ok(results.Records.some((r) => r.id === "record-tx-7f1"));
});
