"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import {
  CalendarDays,
  ChevronRight,
  CirclePlus,
  Gift,
  Heart,
  Home,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  NotebookPen,
  PartyPopper,
  Search,
  Sparkles,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

type Section = "home" | "notes" | "events"
type NotesTab = "shared" | "mine" | "partner"

type Note = {
  title: string
  description: string
  topic: string
  visibility: string
  color: string
  icon: LucideIcon
}

const notes: Record<NotesTab, Note[]> = {
  shared: [
    {
      title: "Вечер кино дома",
      description: "Собрать список фильмов для уютного вечера с пледом…",
      topic: "Отдых",
      visibility: "Общее",
      color: "bg-lavender",
      icon: Sparkles,
    },
    {
      title: "Завтрак в новом месте",
      description: "Попробовать маленькую пекарню рядом с парком в выходные.",
      topic: "Еда",
      visibility: "Общее",
      color: "bg-apricot",
      icon: PartyPopper,
    },
  ],
  mine: [
    {
      title: "Сюрприз на годовщину",
      description: "Проверить свободные даты и придумать маленький подарок.",
      topic: "Сюрприз",
      visibility: "Только мне",
      color: "bg-rose",
      icon: Gift,
    },
    {
      title: "Книги для поездки",
      description: "Сохранить несколько лёгких историй для дороги.",
      topic: "Хобби",
      visibility: "Видно партнёру",
      color: "bg-sage",
      icon: NotebookPen,
    },
  ],
  partner: [
    {
      title: "Место с видом на воду",
      description: "Идея партнёра для спокойного воскресного маршрута.",
      topic: "Прогулка",
      visibility: "Видно партнёру",
      color: "bg-sky",
      icon: Heart,
    },
  ],
}

const events = [
  { day: "Сегодня", title: "Вечер кино", time: "19:30", color: "bg-lavender" },
  {
    day: "Сб, 16 ноября",
    title: "Завтрак в пекарне",
    time: "10:00",
    color: "bg-apricot",
  },
  {
    day: "Вс, 24 ноября",
    title: "Прогулка у воды",
    time: "Весь день",
    color: "bg-sky",
  },
]

const navItems: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Главная", icon: Home },
  { id: "notes", label: "Заметки", icon: NotebookPen },
  { id: "events", label: "События", icon: CalendarDays },
]

function AccessBadge({ visibility }: { visibility: string }) {
  return (
    <Badge
      variant="outline"
      className="gap-1 rounded-full bg-white/65 text-xs font-medium"
    >
      {visibility === "Только мне" ? (
        <LockKeyhole className="size-3" />
      ) : (
        <Users className="size-3" />
      )}
      {visibility}
    </Badge>
  )
}

function NoteCard({ note }: { note: Note }) {
  const Icon = note.icon

  return (
    <Card
      className={`${note.color} rounded-[24px] border-0 shadow-none transition-transform hover:-translate-y-0.5`}
    >
      <CardHeader className="gap-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-white/70 text-primary">
            <Icon className="size-5" />
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full hover:bg-white/50"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Действия с заметкой</span>
          </Button>
        </div>
        <div>
          <CardTitle className="text-lg leading-6">{note.title}</CardTitle>
          <CardDescription className="mt-2 text-foreground/70">
            {note.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2 pt-0">
        <Badge className="rounded-full bg-white/70 text-foreground hover:bg-white/80">
          {note.topic}
        </Badge>
        <AccessBadge visibility={note.visibility} />
      </CardContent>
    </Card>
  )
}

function EventRow({ event }: { event: (typeof events)[number] }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-white/75 p-3">
      <div className={`size-2.5 rounded-full ${event.color}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{event.title}</p>
        <p className="text-xs text-muted-foreground">{event.day}</p>
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {event.time}
      </span>
    </div>
  )
}

function AddNoteDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[24px] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Новая заметка</DialogTitle>
          <DialogDescription>
            Сохрани идею, чтобы вернуться к ней вместе.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Input
            placeholder="Например, выходные в Суздале"
            aria-label="Название заметки"
          />
          <Textarea
            placeholder="Добавь немного деталей…"
            aria-label="Описание заметки"
          />
          <div className="grid gap-2">
            <p className="text-sm font-medium">Кто увидит заметку?</p>
            <RadioGroup
              defaultValue="shared"
              className="grid gap-2 sm:grid-cols-3"
            >
              {[
                ["shared", "Общее"],
                ["partner", "Видно партнёру"],
                ["private", "Только мне"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm has-checked:border-primary has-checked:bg-lavender/45"
                >
                  <RadioGroupItem value={value} />
                  {label}
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={() => onOpenChange(false)}>Сохранить заметку</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Page() {
  const [section, setSection] = React.useState<Section>("home")
  const [notesTab, setNotesTab] = React.useState<NotesTab>("shared")
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date(2026, 10, 14)
  )
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const currentTitle =
    section === "home" ? "Главная" : section === "notes" ? "Заметки" : "События"
  const navigate = (nextSection: Section) => {
    setSection(nextSection)
    setMobileMenuOpen(false)
  }

  return (
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

      <main className="pb-24 lg:ml-[216px] lg:pb-8">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background px-4 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
              <span className="sr-only">Открыть меню</span>
            </Button>
            <div>
              <p className="text-xs text-muted-foreground">
                Пятница, 15 ноября
              </p>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {currentTitle}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="size-4" />
              <span className="sr-only">Поиск</span>
            </Button>
            <div className="flex -space-x-2">
              <Avatar className="size-9 border-2 border-background">
                <AvatarFallback className="bg-apricot text-xs">
                  Вы
                </AvatarFallback>
              </Avatar>
              <Avatar className="size-9 border-2 border-background">
                <AvatarFallback className="bg-lavender text-xs">
                  П
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
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
                    onClick={() => setDialogOpen(true)}
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
              <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <Card className="rounded-[24px] border-border/70 shadow-sm">
                  <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                  <CardContent className="grid gap-3">
                    {events.map((event) => (
                      <EventRow key={event.title} event={event} />
                    ))}
                  </CardContent>
                </Card>
                <Card className="rounded-[24px] border-border/70 shadow-sm">
                  <CardHeader>
                    <CardTitle>Ваши последние заметки</CardTitle>
                    <CardDescription>Идеи, которые рядом</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {notes.shared.map((note) => (
                      <div
                        key={note.title}
                        className="flex items-center gap-3 rounded-2xl bg-muted/60 p-3"
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
                      </div>
                    ))}
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
                  onClick={() => setDialogOpen(true)}
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
                {notes[notesTab].map((note) => (
                  <NoteCard key={note.title} note={note} />
                ))}
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
              <div className="grid gap-6 xl:grid-cols-2">
                <Card className="w-full rounded-[24px] border-border/70 shadow-sm">
                  <CardContent className="flex justify-center p-3">
                    <Calendar
                      className="calendar-wide mx-auto w-full max-w-[720px]"
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                    />
                  </CardContent>
                </Card>
                <Card className="rounded-[24px] border-border/70 shadow-sm">
                  <CardHeader>
                    <CardTitle>Ноябрь 2026</CardTitle>
                    <CardDescription>
                      События на выбранную дату и ближайшие планы
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3">
                    {events.map((event) => (
                      <EventRow key={event.title} event={event} />
                    ))}
                    <Button
                      variant="outline"
                      className="mt-2 w-fit rounded-xl"
                      onClick={() => setDialogOpen(true)}
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
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          role="dialog"
          aria-label="Мобильное меню"
        >
          <button
            className="absolute inset-0 size-full cursor-default bg-black/30"
            aria-label="Закрыть меню"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative h-full w-[280px] bg-background p-6 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="font-semibold">Вместе</p>
                <p className="text-sm text-muted-foreground">
                  пространство для двоих
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span aria-hidden>×</span>
                <span className="sr-only">Закрыть меню</span>
              </Button>
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
          </div>
        </div>
      )}
      <AddNoteDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
