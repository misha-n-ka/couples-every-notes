export type NoteVisibility = "shared" | "partner" | "private"
export type NoteAuthor = "me" | "partner"

export type Schedule = {
  allDay: boolean
  date: string
  endDate?: string
  start?: string
  end?: string
}

export function isTimedScheduleValid(schedule: Schedule) {
  if (schedule.allDay) return Boolean(schedule.date)
  if (!schedule.date || !schedule.endDate || !schedule.start || !schedule.end)
    return false

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
