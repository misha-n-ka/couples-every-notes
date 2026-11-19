export type NoteVisibility = "shared" | "partner" | "private"
export type NoteAuthor = "me" | "partner"

export type Schedule = {
  allDay: boolean
  date: string
  endDate?: string
  start?: string
  end?: string
}

export function formatTimeInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}:${digits.slice(2)}`
}

export function isTimedScheduleValid(schedule: Schedule) {
  if (schedule.allDay) return Boolean(schedule.date)
  if (!schedule.date || !schedule.endDate || !schedule.start || !schedule.end)
    return false

  const validTime = (value: string) => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)
  if (!validTime(schedule.start) || !validTime(schedule.end)) return false

  return (
    `${schedule.endDate}T${schedule.end}` > `${schedule.date}T${schedule.start}`
  )
}

export function isMineNote(note: {
  author: NoteAuthor
  visibility: NoteVisibility
}) {
  return note.author === "me" && note.visibility !== "shared"
}

export function isVisibilityExpansion(
  current: NoteVisibility,
  next: NoteVisibility
) {
  const accessRank = { private: 0, partner: 1, shared: 2 }
  return accessRank[next] > accessRank[current]
}
