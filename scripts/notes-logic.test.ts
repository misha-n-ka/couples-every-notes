import assert from "node:assert/strict"
import test from "node:test"

import {
  formatTimeInput,
  isMineNote,
  isTimedScheduleValid,
  isVisibilityExpansion,
  type Schedule,
} from "../lib/notes.ts"

test("formats time input as hours and minutes", () => {
  assert.equal(formatTimeInput("1930"), "19:30")
  assert.equal(formatTimeInput("19a3"), "19:3")
  assert.equal(formatTimeInput("12345"), "12:34")
})

test("accepts a timed event that ends after midnight", () => {
  const schedule: Schedule = {
    allDay: false,
    date: "2026-11-15",
    endDate: "2026-11-16",
    start: "22:00",
    end: "01:00",
  }

  assert.equal(isTimedScheduleValid(schedule), true)
})

test("rejects an event whose end is not after its start", () => {
  assert.equal(
    isTimedScheduleValid({
      allDay: false,
      date: "2026-11-15",
      endDate: "2026-11-15",
      start: "22:00",
      end: "01:00",
    }),
    false
  )
})

test("keeps shared notes out of the personal tab", () => {
  assert.equal(isMineNote({ author: "me", visibility: "private" }), true)
  assert.equal(isMineNote({ author: "me", visibility: "partner" }), true)
  assert.equal(isMineNote({ author: "me", visibility: "shared" }), false)
})

test("recognizes visibility changes that need confirmation", () => {
  assert.equal(isVisibilityExpansion("private", "partner"), true)
  assert.equal(isVisibilityExpansion("partner", "shared"), true)
  assert.equal(isVisibilityExpansion("shared", "private"), false)
})
