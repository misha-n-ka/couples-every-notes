"use client"

import * as React from "react"
import { ru } from "date-fns/locale"
import type { LucideIcon } from "lucide-react"
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Copy,
  Edit3,
  Gift,
  Heart,
  Home,
  Link as LinkIcon,
  LockKeyhole,
  MoreHorizontal,
  NotebookPen,
  PartyPopper,
  Search,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Toaster, toast } from "@/components/ui/toast"
import {
  isMineNote,
  formatTimeInput,
  isTimedScheduleValid,
  isVisibilityExpansion,
  type NoteAuthor,
  type NoteVisibility,
  type Schedule,
} from "@/lib/notes"

type Section = "home" | "notes" | "events"
type NotesTab = "shared" | "mine" | "partner"
type Visibility = NoteVisibility
type Topic = "Подарки" | "Еда" | "Хобби" | "Фильмы и сериалы"
type Author = NoteAuthor

type Note = {
  id: string
  title: string
  description: string
  url: string
  topic: Topic
  visibility: Visibility
  color: string
  icon: LucideIcon
  author: Author
  schedule?: Schedule
}

const visibilityLabels: Record<Visibility, string> = {
  shared: "Общее",
  partner: "Видно партнёру",
  private: "Только мне",
}

const topicStyles: Record<Topic, { color: string; icon: LucideIcon }> = {
  Подарки: { color: "bg-lavender", icon: Gift },
  Еда: { color: "bg-apricot", icon: PartyPopper },
  Хобби: { color: "bg-sage", icon: NotebookPen },
  "Фильмы и сериалы": { color: "bg-sky", icon: Sparkles },
}

const initialNotes: Note[] = [
  {
    id: "movie-night",
    title: "Вечер кино дома",
    description: "Собрать список фильмов для уютного вечера с пледом…",
    url: "",
    topic: "Фильмы и сериалы",
    visibility: "shared",
    ...topicStyles["Фильмы и сериалы"],
    author: "me",
    schedule: {
      allDay: false,
      date: "2026-11-15",
      start: "19:30",
      end: "21:30",
    },
  },
  {
    id: "bakery",
    title: "Завтрак в новом месте",
    description: "Попробовать маленькую пекарню рядом с парком в выходные.",
    url: "",
    topic: "Еда",
    visibility: "shared",
    ...topicStyles.Еда,
    author: "partner",
    schedule: {
      allDay: false,
      date: "2026-11-16",
      start: "10:00",
      end: "11:30",
    },
  },
  {
    id: "anniversary",
    title: "Сюрприз на годовщину",
    description: "Проверить свободные даты и придумать маленький подарок.",
    url: "",
    topic: "Подарки",
    visibility: "private",
    ...topicStyles.Подарки,
    author: "me",
  },
  {
    id: "books",
    title: "Книги для поездки",
    description: "Сохранить несколько лёгких историй для дороги.",
    url: "",
    topic: "Хобби",
    visibility: "partner",
    ...topicStyles.Хобби,
    author: "me",
  },
  {
    id: "water-view",
    title: "Место с видом на воду",
    description: "Идея партнёра для спокойного воскресного маршрута.",
    url: "",
    topic: "Хобби",
    visibility: "partner",
    ...topicStyles.Хобби,
    author: "partner",
    schedule: { allDay: true, date: "2026-11-24" },
  },
]

const demoToday = new Date()

const navItems: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Главная", icon: Home },
  { id: "notes", label: "Заметки", icon: NotebookPen },
  { id: "events", label: "События", icon: CalendarDays },
]
const topics: Topic[] = ["Подарки", "Еда", "Хобби", "Фильмы и сериалы"]

function AccessBadge({ visibility }: { visibility: Visibility }) {
  return (
    <Badge
      variant="outline"
      className="gap-1 rounded-full bg-white/65 text-xs font-medium"
    >
      {visibility === "private" ? (
        <LockKeyhole className="size-3" />
      ) : (
        <Users className="size-3" />
      )}
      {visibilityLabels[visibility]}
    </Badge>
  )
}

function formatEventDate(schedule: Schedule) {
  const formatDay = (value: string) =>
    new Date(`${value}T00:00:00`).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
    })
  const startDay = formatDay(schedule.date)
  if (schedule.allDay) return `${startDay}, весь день`
  const endDay = formatDay(schedule.endDate ?? schedule.date)
  return startDay === endDay
    ? `${startDay}, ${schedule.start}–${schedule.end}`
    : `${startDay}, ${schedule.start}–${endDay}, ${schedule.end}`
}

function formatDemoDate(date: Date) {
  const value = date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function EventRow({ note, onOpen }: { note: Note; onOpen?: () => void }) {
  if (!note.schedule) return null
  return (
    <button
      type="button"
      onClick={onOpen}
      className="interactive-surface flex min-w-0 w-full flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-white/75 p-3 text-left hover:border-primary/40 hover:bg-lavender/30"
    >
      <div className={`size-2.5 rounded-full ${note.color}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{note.title}</p>
        <p className="text-xs text-muted-foreground">
          {formatEventDate(note.schedule)}
        </p>
      </div>
      <AccessBadge visibility={note.visibility} />
    </button>
  )
}

function EventCalendarDayButton({
  eventColors,
  ...props
}: React.ComponentProps<typeof CalendarDayButton> & {
  eventColors: Record<string, string[]>
}) {
  const colors = eventColors[dateKey(props.day.date)] ?? []

  return (
    <div className="relative flex size-full items-center justify-center">
      <CalendarDayButton {...props} />
      {colors.length > 0 && (
        <span className="pointer-events-none absolute bottom-2 z-30 flex gap-0.5 leading-none">
          {colors.slice(0, 3).map((color, index) => (
            <span
              key={`${color}-${index}`}
              className="size-2 rounded-full bg-primary ring-1 ring-white"
            />
          ))}
        </span>
      )}
    </div>
  )
}

function NoteCard({
  note,
  canEdit,
  onOpen,
  onEdit,
  onDelete,
  onCopy,
}: {
  note: Note
  canEdit: boolean
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
  onCopy: () => void
}) {
  const Icon = note.icon
  return (
    <Card
      interactive
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onOpen()
        }
      }}
      className={`${note.color} border-0 shadow-none`}
    >
      <CardHeader className="gap-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-white/70 text-primary">
            <Icon className="size-5" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full hover:bg-white/50"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                />
              }
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Действия с заметкой</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Edit3 /> Редактировать
                </DropdownMenuItem>
              )}
              {note.visibility === "shared" && (
                <DropdownMenuItem onClick={onCopy}>
                  <Copy /> Скопировать в Моё
                </DropdownMenuItem>
              )}
              {canEdit && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={onDelete}>
                    <Trash2 /> Удалить
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <CardTitle className="text-lg leading-6">{note.title}</CardTitle>
          <CardDescription className="mt-2 text-foreground/70">
            {note.description}
          </CardDescription>
          {note.url && (
            <a
              href={note.url}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="mt-2 inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2"
            >
              <LinkIcon className="size-3" /> Открыть ссылку
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-2 pt-0">
        <Badge className="rounded-full bg-white/70 text-foreground hover:bg-white/80">
          {note.topic}
        </Badge>
        <AccessBadge visibility={note.visibility} />
      </CardContent>
    </Card>
  )
}

function NoteDetailsDialog({
  note,
  open,
  canEdit,
  onOpenChange,
  onEdit,
}: {
  note?: Note
  open: boolean
  canEdit: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
}) {
  if (!note) return null
  const Icon = note.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[24px] sm:max-w-lg">
        <DialogHeader>
          <div
            className={`mb-2 flex size-12 items-center justify-center rounded-2xl ${note.color}`}
          >
            <Icon className="size-6 text-primary" />
          </div>
          <DialogTitle>{note.title}</DialogTitle>
          <DialogDescription>
            {note.description || "Без описания"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full bg-muted text-foreground">
              {note.topic}
            </Badge>
            <AccessBadge visibility={note.visibility} />
          </div>
          {note.url && (
            <a
              href={note.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-primary underline underline-offset-2"
            >
              <LinkIcon className="size-4" /> Открыть ссылку
            </a>
          )}
          {note.schedule && (
            <div className="rounded-2xl bg-muted/60 p-4">
              <p className="font-medium">Событие</p>
              <p className="mt-1 text-muted-foreground">
                {formatEventDate(note.schedule)}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Закрыть
          </Button>
          {canEdit && (
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false)
                onEdit()
              }}
            >
              Редактировать
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DateField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const selectedDate = value ? new Date(`${value}T00:00:00`) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full justify-between rounded-2xl bg-white px-3 font-normal"
          />
        }
      >
        {selectedDate
          ? selectedDate.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "Выберите дату"}
        <CalendarDays className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <Calendar
          mode="single"
          locale={ru}
          selected={selectedDate}
          onSelect={(nextDate) => {
            if (!nextDate) return
            onChange(dateKey(nextDate))
            setOpen(false)
          }}
          showOutsideDays={false}
        />
      </PopoverContent>
    </Popover>
  )
}

function TimeField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(event) => onChange(formatTimeInput(event.target.value))}
      inputMode="numeric"
      placeholder="19:30"
      maxLength={5}
      pattern="(?:[01]\d|2[0-3]):[0-5]\d"
      aria-label="Время в формате часы и минуты"
    />
  )
}

function AddNoteDialog({
  open,
  onOpenChange,
  onSave,
  editingNote,
  initialVisibility,
  initialWithEvent = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<Note, "id" | "color" | "icon" | "author">) => void
  editingNote?: Note
  initialVisibility: Visibility
  initialWithEvent?: boolean
}) {
  const [title, setTitle] = React.useState(editingNote?.title ?? "")
  const [description, setDescription] = React.useState(
    editingNote?.description ?? ""
  )
  const [url, setUrl] = React.useState(editingNote?.url ?? "")
  const [topic, setTopic] = React.useState<Topic>(
    editingNote?.topic ?? "Подарки"
  )
  const [visibility, setVisibility] = React.useState<Visibility>(
    editingNote?.visibility ?? initialVisibility
  )
  const [withEvent, setWithEvent] = React.useState(
    Boolean(editingNote?.schedule) || initialWithEvent
  )
  const [allDay, setAllDay] = React.useState(
    editingNote?.schedule?.allDay ?? false
  )
  const [date, setDate] = React.useState(editingNote?.schedule?.date ?? "")
  const [endDate, setEndDate] = React.useState(
    editingNote?.schedule?.endDate ?? editingNote?.schedule?.date ?? ""
  )
  const [start, setStart] = React.useState(editingNote?.schedule?.start ?? "")
  const [end, setEnd] = React.useState(editingNote?.schedule?.end ?? "")
  const [error, setError] = React.useState("")
  const [pendingVisibility, setPendingVisibility] = React.useState<Visibility>()

  const handleVisibilityChange = (value: string) => {
    const nextVisibility = value as Visibility
    if (isVisibilityExpansion(visibility, nextVisibility)) {
      setPendingVisibility(nextVisibility)
      return
    }
    setVisibility(nextVisibility)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) return setError("Добавьте название заметки.")
    if (withEvent && !date) return setError("Выберите дату события.")
    if (
      withEvent &&
      !allDay &&
      !isTimedScheduleValid({ allDay, date, endDate, start, end })
    )
      return setError("Для события укажите начало и окончание позже начала.")
    onSave({
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      topic,
      visibility,
      schedule: withEvent
        ? { allDay, date, ...(allDay ? {} : { endDate, start, end }) }
        : undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-0 max-h-[calc(100dvh-2rem)] overflow-visible rounded-[24px] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingNote ? "Редактировать заметку" : "Новая заметка"}
          </DialogTitle>
          <DialogDescription>
            Сохрани идею, чтобы вернуться к ней вместе.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid min-w-0 max-h-[calc(100dvh-10rem)] gap-4 overflow-y-auto px-1 pr-3"
          onSubmit={handleSubmit}
        >
          <label className="grid gap-1.5 text-sm font-medium">
            Название
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Например, выходные в Суздале"
              autoFocus
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Описание
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Добавь немного деталей…"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Ссылка{" "}
            <span className="font-normal text-muted-foreground">
              (необязательно)
            </span>
            <Input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://…"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Тема
            <div className="relative">
              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value as Topic)}
                className="h-9 w-full appearance-none rounded-2xl border border-input bg-input/50 px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {topics.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </label>
          <div className="grid gap-2">
            <p className="text-sm font-medium">Кто увидит заметку?</p>
            <RadioGroup
              value={visibility}
              onValueChange={handleVisibilityChange}
              className="grid gap-2 sm:grid-cols-3"
            >
              {(["shared", "partner", "private"] as Visibility[]).map(
                (value) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm has-checked:border-primary has-checked:bg-lavender/45"
                  >
                    <RadioGroupItem value={value} /> {visibilityLabels[value]}
                  </label>
                )
              )}
            </RadioGroup>
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm">
            <input
              type="checkbox"
              checked={withEvent}
              onChange={(event) => setWithEvent(event.target.checked)}
              className="size-4 accent-primary"
            />{" "}
            Запланировать как событие
          </label>
          {withEvent && (
            <div className="grid gap-3 rounded-2xl bg-muted/60 p-3">
              <label className="grid gap-1.5 text-sm font-medium">
                Дата начала
                <DateField value={date} onChange={setDate} />
              </label>
              {!allDay && (
                <label className="grid gap-1.5 text-sm font-medium">
                  Дата окончания
                  <DateField value={endDate} onChange={setEndDate} />
                </label>
              )}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(event) => setAllDay(event.target.checked)}
                  className="size-4 accent-primary"
                />{" "}
                Весь день
              </label>
              {!allDay && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1.5 text-sm font-medium">
                    Начало
                    <TimeField value={start} onChange={setStart} />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    Окончание
                    <TimeField value={end} onChange={setEnd} />
                  </label>
                </div>
              )}
            </div>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-rose/70 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit">
              {editingNote ? "Сохранить изменения" : "Сохранить заметку"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <AlertDialog
        open={Boolean(pendingVisibility)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setPendingVisibility(undefined)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Открыть заметку партнёру?</AlertDialogTitle>
            <AlertDialogDescription>
              Партнёр получит доступ к этой заметке в режиме «
              {pendingVisibility ? visibilityLabels[pendingVisibility] : ""}».
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingVisibility) setVisibility(pendingVisibility)
                setPendingVisibility(undefined)
              }}
            >
              Открыть доступ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}

export default function Page() {
  const [section, setSection] = React.useState<Section>("home")
  const [notesTab, setNotesTab] = React.useState<NotesTab>("shared")
  const [notes, setNotes] = React.useState<Note[]>(initialNotes)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    demoToday
  )
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingNote, setEditingNote] = React.useState<Note | undefined>()
  const [dialogVisibility, setDialogVisibility] =
    React.useState<Visibility>("private")
  const [dialogWithEvent, setDialogWithEvent] = React.useState(false)
  const [selectedNote, setSelectedNote] = React.useState<Note | undefined>()
  const [detailsOpen, setDetailsOpen] = React.useState(false)

  const currentTitle =
    section === "home" ? "Главная" : section === "notes" ? "Заметки" : "События"
  const visibleNotes = notes.filter(
    (note) =>
      note.visibility === "shared" ||
      note.author === "me" ||
      note.visibility === "partner"
  )
  const sharedNotes = visibleNotes.filter(
    (note) => note.visibility === "shared"
  )
  const mineNotes = visibleNotes.filter(isMineNote)
  const partnerNotes = visibleNotes.filter(
    (note) => note.author === "partner" && note.visibility !== "private"
  )
  const tabNotes =
    notesTab === "shared"
      ? sharedNotes
      : notesTab === "mine"
        ? mineNotes
        : partnerNotes
  const scheduledNotes = visibleNotes
    .filter((note) => note.schedule)
    .sort((a, b) =>
      (a.schedule?.date ?? "").localeCompare(b.schedule?.date ?? "")
    )
  const homeScheduledNotes = scheduledNotes.filter(
    (note) => note.visibility !== "private"
  )
  const selectedDateKey = selectedDate ? dateKey(selectedDate) : undefined
  const selectedEvents = scheduledNotes.filter(
    (note) => note.schedule?.date === selectedDateKey
  )
  const eventColors = scheduledNotes.reduce<Record<string, string[]>>(
    (result, note) => {
      if (!note.schedule) return result
      const colors = result[note.schedule.date] ?? []
      if (!colors.includes(note.color))
        result[note.schedule.date] = [...colors, note.color]
      return result
    },
    {}
  )

  const navigate = (nextSection: Section) => {
    setSection(nextSection)
  }
  const openNewNote = (
    visibility: Visibility = section === "notes" && notesTab === "shared"
      ? "shared"
      : "private",
    withEvent = false
  ) => {
    setEditingNote(undefined)
    setDialogVisibility(visibility)
    setDialogWithEvent(withEvent)
    setDialogOpen(true)
  }
  const saveNote = (data: Omit<Note, "id" | "color" | "icon" | "author">) => {
    const style = topicStyles[data.topic]
    if (editingNote) {
      setNotes((current) =>
        current.map((note) =>
          note.id === editingNote.id ? { ...note, ...data, ...style } : note
        )
      )
      return
    }
    setNotes((current) => [
      { ...data, ...style, id: `note-${Date.now()}`, author: "me" },
      ...current,
    ])
    toast.add({
      title: "Заметка сохранена",
      description:
        "Пока она доступна только в этой сессии. Постоянное сохранение появится после подключения авторизации и базы данных.",
    })
  }
  const editNote = (note: Note) => {
    setEditingNote(note)
    setDialogVisibility(note.visibility)
    setDialogWithEvent(Boolean(note.schedule))
    setDialogOpen(true)
  }
  const openDetails = (note: Note) => {
    setSelectedNote(note)
    setDetailsOpen(true)
  }
  const deleteNote = (note: Note) => {
    if (window.confirm(`Удалить заметку «${note.title}»?`))
      setNotes((current) => current.filter((item) => item.id !== note.id))
  }
  const copyNote = (note: Note) => {
    setNotes((current) => [
      {
        ...note,
        id: `note-${Date.now()}`,
        title: `${note.title} — копия`,
        visibility: "private",
        author: "me",
      },
      ...current,
    ])
    setNotesTab("mine")
    setSection("notes")
  }

  return (
    <Toaster>
      <div className="min-h-svh bg-background text-foreground">
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-[216px] flex-col border-r border-border/70 bg-white/60 px-5 py-6 lg:flex">
          <div className="mb-10 flex items-center gap-3 px-2">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Heart className="size-5 fill-current" />
            </div>
            <div>
              <p className="font-semibold tracking-tight">Вместе</p>
              <p className="text-xs text-muted-foreground">
                пространство для двоих
              </p>
            </div>
          </div>
          <nav className="grid gap-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={section === id ? "secondary" : "ghost"}
                className="justify-start gap-3 rounded-xl"
                onClick={() => navigate(id)}
              >
                <Icon className="size-4" />
                {label}
              </Button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl bg-lavender/70 p-4">
            <Sparkles className="mb-3 size-5 text-primary" />
            <p className="text-sm font-semibold">Маленькие планы тоже важны</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Сохраняйте идеи, чтобы однажды превратить их в воспоминания.
            </p>
          </div>
        </aside>
        <main className="min-w-0 overflow-x-hidden pb-24 lg:ml-[216px] lg:pb-8">
          <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background px-4 py-4 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  {formatDemoDate(demoToday)}
                </p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {currentTitle}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() =>
                  toast.add({
                    title: "Поиск пока недоступен",
                    description:
                      "Функционал появится после подключения backend.",
                  })
                }
              >
                <Search className="size-4" />
                <span className="sr-only">Поиск</span>
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="size-9 border-2 border-background">
                  <AvatarFallback className="bg-apricot text-xs">
                    К
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">
                  Кирилл
                </span>
              </div>
            </div>
          </header>
          <div className="mx-auto w-full max-w-[1200px] min-w-0 space-y-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
            {section === "home" && (
              <>
                <section className="grid gap-5 rounded-[28px] bg-gradient-to-br from-lavender to-apricot p-6 sm:p-8 lg:grid-cols-[1.3fr_0.7fr]">
                  <div className="flex flex-col justify-between gap-8">
                    <div>
                      <Badge className="mb-4 rounded-full bg-white/70 text-primary hover:bg-white/80">
                        <Heart className="mr-1 size-3 fill-current" />
                        Ваше пространство
                      </Badge>
                      <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
                        Привет! Что создадим вместе?
                      </h2>
                      <p className="mt-3 max-w-lg text-sm leading-6 text-foreground/70">
                        Собирайте маленькие желания, планы и сюрпризы в одном
                        уютном месте.
                      </p>
                    </div>
                    <Button
                      className="w-fit rounded-xl"
                      onClick={() => openNewNote()}
                    >
                      <CirclePlus className="mr-2 size-4" />
                      Добавить заметку
                    </Button>
                  </div>
                  <div className="hidden items-end justify-end lg:flex">
                    <div className="flex size-44 items-center justify-center rounded-full bg-white/45">
                      <Heart className="size-20 fill-white text-white/80" />
                    </div>
                  </div>
                </section>
                <section className="grid min-w-0 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                  <Card className="min-w-0 rounded-[24px] border-border/70 shadow-sm">
                    <CardHeader className="min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle>Ближайшие события</CardTitle>
                        <CardDescription>
                          То, что уже хочется ждать
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-fit justify-start self-start rounded-xl px-2 text-primary"
                        onClick={() => navigate("events")}
                      >
                        Все события
                        <ChevronRight className="ml-1 size-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="grid min-w-0 gap-3">
                      {homeScheduledNotes.slice(0, 3).map((note) => (
                        <EventRow
                          key={note.id}
                          note={note}
                          onOpen={() => openDetails(note)}
                        />
                      ))}
                      {homeScheduledNotes.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Событий пока нет. Запланируйте что-нибудь приятное.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="min-w-0 rounded-[24px] border-border/70 shadow-sm">
                    <CardHeader>
                      <CardTitle>Ваши последние заметки</CardTitle>
                      <CardDescription>Идеи, которые рядом</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      {sharedNotes.slice(0, 3).map((note) => (
                        <button
                          type="button"
                          key={note.id}
                          className="interactive-surface flex items-center gap-3 rounded-2xl bg-muted/60 p-3 text-left hover:bg-muted"
                          onClick={() => openDetails(note)}
                        >
                          <div
                            className={`flex size-9 items-center justify-center rounded-xl ${note.color}`}
                          >
                            <note.icon className="size-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {note.title}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {note.topic}
                            </p>
                          </div>
                        </button>
                      ))}
                      {sharedNotes.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Общих заметок пока нет.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </section>
              </>
            )}
            {section === "notes" && (
              <section className="space-y-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ваши идеи и планы
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                      Все заметки
                    </h2>
                  </div>
                  <Button
                    className="w-fit rounded-xl"
                    onClick={() => openNewNote()}
                  >
                    <CirclePlus className="mr-2 size-4" />
                    Новая заметка
                  </Button>
                </div>
                <div
                  className="flex flex-wrap gap-2"
                  role="tablist"
                  aria-label="Раздел заметок"
                >
                  {(
                    [
                      ["shared", "Общее"],
                      ["mine", "Моё"],
                      ["partner", "Партнёра"],
                    ] as const
                  ).map(([tab, label]) => (
                    <Button
                      key={tab}
                      role="tab"
                      aria-selected={notesTab === tab}
                      variant={notesTab === tab ? "secondary" : "ghost"}
                      className="h-9 rounded-full px-4"
                      onClick={() => setNotesTab(tab)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {tabNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onOpen={() => openDetails(note)}
                      canEdit={
                        note.visibility === "shared" || note.author === "me"
                      }
                      onEdit={() => editNote(note)}
                      onDelete={() => deleteNote(note)}
                      onCopy={() => copyNote(note)}
                    />
                  ))}
                  {tabNotes.length === 0 && (
                    <Card className="rounded-[24px] border-dashed shadow-none sm:col-span-2 xl:col-span-3">
                      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                        <NotebookPen className="size-8 text-primary" />
                        <p className="font-semibold">Здесь пока пусто</p>
                        <p className="text-sm text-muted-foreground">
                          Создайте заметку, чтобы сохранить первую идею.
                        </p>
                        <Button onClick={() => openNewNote()}>
                          Добавить заметку
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </section>
            )}
            {section === "events" && (
              <section className="space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Общие и личные планы
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    Календарь событий
                  </h2>
                </div>
                <div className="grid min-w-0 gap-6 xl:grid-cols-2">
                  <Card className="min-w-0 w-full rounded-[24px] border-border/70 shadow-sm">
                    <CardContent className="flex justify-center p-3">
                      <Calendar
                        className="calendar-wide mx-auto w-full max-w-[720px]"
                        mode="single"
                        required
                        locale={ru}
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        components={{
                          DayButton: (props) => (
                            <EventCalendarDayButton
                              {...props}
                              eventColors={eventColors}
                            />
                          ),
                        }}
                      />
                    </CardContent>
                  </Card>
                  <Card className="min-w-0 rounded-[24px] border-border/70 shadow-sm">
                    <CardHeader>
                      <CardTitle>События на выбранную дату</CardTitle>
                      <CardDescription>
                        Москва ·{" "}
                        {selectedDate
                          ? selectedDate.toLocaleDateString("ru-RU", {
                              day: "numeric",
                              month: "long",
                            })
                          : "дата не выбрана"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      {selectedEvents.map((note) => (
                        <EventRow
                          key={note.id}
                          note={note}
                          onOpen={() => openDetails(note)}
                        />
                      ))}
                      {selectedEvents.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          На этот день событий нет.
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="mt-2 w-fit rounded-xl"
                        onClick={() => openNewNote("shared", true)}
                      >
                        <CirclePlus className="mr-2 size-4" />
                        Добавить событие
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}
          </div>
        </main>
        <nav className="fixed right-4 bottom-4 left-4 z-20 grid grid-cols-3 gap-2 rounded-2xl border border-border/70 bg-white/90 p-2 shadow-lg backdrop-blur-md lg:hidden">
          {navItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={section === id ? "secondary" : "ghost"}
              className="h-12 flex-col gap-1 rounded-xl text-[11px]"
              onClick={() => navigate(id)}
            >
              <Icon className="size-4" />
              {label}
            </Button>
          ))}
        </nav>
        <NoteDetailsDialog
          note={selectedNote}
          open={detailsOpen}
          canEdit={Boolean(
            selectedNote &&
            (selectedNote.visibility === "shared" ||
              selectedNote.author === "me")
          )}
          onOpenChange={setDetailsOpen}
          onEdit={() => selectedNote && editNote(selectedNote)}
        />
        <AddNoteDialog
          key={`${dialogOpen}-${editingNote?.id ?? "new"}`}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={saveNote}
          editingNote={editingNote}
          initialVisibility={dialogVisibility}
          initialWithEvent={dialogWithEvent}
        />
      </div>
    </Toaster>
  )
}
