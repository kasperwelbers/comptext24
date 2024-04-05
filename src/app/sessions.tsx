import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronRight, Loader, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Highlighter from "react-highlight-words";

interface Props {
  program: Record<string, string | number>[];
}

interface Session {
  id: number;
  title: string;
  day: string;
  time: string;
  slot: string;
  discussant: string;
  presentations: Presentation[];
}

interface Presentation {
  id: number;
  title: string;
  text: string;
  authors: string[];
  discipline: string[];
  keywords: string[];
  approach: string;
  data: string;
  issues: string;
  geofocus: string;
  corresponding: string;
  highlight: boolean;
  stringified: string;
}

export default function Sessions({ program }: Props) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncing, setDebouncing] = useState(false);
  const [showPresentation, setShowPresentation] = useState<Presentation | null>(null);

  useEffect(() => {
    setDebouncing(true);
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncing(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const sessions = useMemo(() => {
    const sessions: Record<number, Session> = {};
    for (const item of program) {
      const id = Number(item.session);
      if (!sessions[id]) {
        sessions[id] = {
          id: Number(item.session),
          title: String(item.session_title),
          day: String(item.time).split(",")[0],
          time: String(item.time).split(", ")[1].split("-")[0],
          slot: String(item.slot),
          discussant: String(item.discussant),
          presentations: [],
        };
      }
      const presentation = {
        id: Number(item.id),
        title: String(item.Title),
        text: String(item.full_text),
        authors: String(item.authors).split(/; ?/),
        discipline: String(item.Discipline).split(/; ?/),
        keywords: String(item.keywords).split(/; ?/),
        approach: String(item.approach),
        data: String(item.data),
        issues: String(item.issues),
        geofocus: String(item.geofocus),
        corresponding: String(item.corresponding),
        highlight: false,
        stringified: "",
      };
      presentation.stringified = JSON.stringify(Object.values(presentation));
      sessions[id].presentations.push(presentation);
    }
    return Object.values(sessions).sort((a, b) => a.slot.localeCompare(b.slot));
  }, [program]);

  const filteredSessions = useMemo(() => {
    if (!debouncedSearch) return sessions;
    const fs: Session[] = [];
    for (const session of sessions) {
      const showPresentations: Presentation[] = [];
      let showSession = false;
      for (const presentation of session.presentations) {
        if (presentation.stringified.toLowerCase().includes(debouncedSearch.toLowerCase())) {
          showPresentations.push({ ...presentation, highlight: true });
          showSession = true;
        } else {
          showPresentations.push(presentation);
        }
      }
      if (showSession) {
        fs.push({ ...session, presentations: showPresentations });
      }
    }
    return fs;
  }, [sessions, debouncedSearch]);

  const [day1Sessions, day2Sessions] = useMemo(() => {
    const day1Sessions = filteredSessions.filter((s) => s.day === "Friday");
    const day2Sessions = filteredSessions.filter((s) => s.day === "Saturday");
    return [day1Sessions, day2Sessions];
  }, [filteredSessions]);

  return (
    <div className="relative mb-10">
      <div className="relative flex gap-3 items-center justify-end my-3">
        {debouncing ? <Loader className="spinner" /> : <Search />}
        <Input
          className="relative w-52 focus-visible:ring-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />
        <div className="absolute right-2">
          <X className="cursor-pointer text-gray-400 hover:text-foreground" onClick={() => setSearch("")} />
        </div>
      </div>
      <h3 className="bg-primary font-bold text-lg text-white px-2 py-2 rounded">Friday</h3>
      <DaySessions sessions={day1Sessions} search={debouncedSearch} setShowPresentation={setShowPresentation} />
      <h3 className="mt-5 bg-primary font-bold text-lg text-white px-2 py-2 rounded">Saturday</h3>
      <DaySessions sessions={day2Sessions} search={debouncedSearch} setShowPresentation={setShowPresentation} />
      <PresentationDialog presentation={showPresentation} search={search} setShowPresentation={setShowPresentation} />
    </div>
  );
}

function DaySessions({
  sessions,
  search,
  setShowPresentation,
}: {
  sessions: Session[];
  search: string;
  setShowPresentation: any;
}) {
  const [accordionValue, setAccordionValue] = useState<string | undefined>();

  useEffect(() => {
    setAccordionValue("");
  }, [search]);

  return (
    <Accordion className="px-2" type="single" collapsible value={accordionValue} onValueChange={setAccordionValue}>
      {sessions.map((session) => (
        <AccordionItem className="m-0" value={session.title}>
          <AccordionTrigger className="">
            <div className="text-base items-center grid grid-cols-[4rem,1fr]">
              <div className="text-primary w-16 text-left">{session.time}</div>
              <div className="my-0 text-left">{session.title}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="">
            <Presentations
              presentations={session.presentations}
              search={search}
              discussant={session.discussant}
              setShowPresentation={setShowPresentation}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
function PresentationDialog({
  presentation,
  search,
  setShowPresentation,
}: {
  presentation: Presentation | null;
  search: string;
  setShowPresentation: (p: Presentation | null) => void;
}) {
  if (!presentation) return null;
  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) setShowPresentation(null);
      }}
    >
      <DialogContent className="max-w-[900px] w-[95vw] max-h-[min(80vh,800px)] overflow-auto">
        <div className="flex flex-col">
          <h2 className="text-xl font-medium">
            <HighlightSearch search={search} text={presentation.title} />
          </h2>
          <h3 className="text-base italic mt-2">
            <HighlightSearch search={search} text={presentation.authors.join(", ")} />
          </h3>
          <div className="flex gap-2 mt-5 flex-wrap">
            <Tags presentation={presentation} item="discipline" search={search} />
            <Tags presentation={presentation} item="keywords" search={search} />
            <Tags presentation={presentation} item="approach" search={search} />
            <Tags presentation={presentation} item="data" search={search} />
            <Tags presentation={presentation} item="issues" search={search} />
            <Tags presentation={presentation} item="geofocus" search={search} />
          </div>
          <div className="text-primary text-right text-sm mt-1">* AI generated</div>
          <div>
            <h3 className="text-lg font-medium mt-5">Abstract</h3>
            <p className="mt-2 ">
              <HighlightSearch text={presentation.text} search={search} />
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Tags({
  presentation,
  item,
  search,
}: {
  presentation: Presentation;
  item: keyof Presentation;
  search: string;
}) {
  let value = presentation[item];
  if (Array.isArray(value)) value = value.join(", ");
  if (!value || value === "undefined") return null;
  return (
    <div className="flex-auto flex items-center justify-start gap-3 bg-primary/20 rounded px-2 py-1">
      <div className=" font-medium  text-sm min-w-[4rem] sm:min-w-0">{item}</div>
      <div className="flex gap-2">
        <span className="text-xs">
          <HighlightSearch text={String(value)} search={search} />
        </span>
      </div>
    </div>
  );
}

function Presentations({
  presentations,
  search,
  discussant,
  setShowPresentation,
}: {
  presentations: Presentation[];
  search: string;
  discussant: string;
  setShowPresentation: (p: Presentation) => void;
}) {
  return (
    <div className="flex flex-col bg-primary/10 rounded">
      <h3 className="text-primary text-base font-bold p-2 pl-3">
        <span>Discussant: </span>
        <span>{discussant}</span>
      </h3>
      {presentations.map((presentation) => {
        // const color = presentation.highlight ? "bg-secondary/30 hover:bg-primary/40" : "hover:bg-primary/20";
        const color = "hover:bg-primary/20";
        return (
          <div
            key={presentation.id}
            className={`${color} p-2 pl-3 rounded cursor-pointer`}
            onClick={() => setShowPresentation(presentation)}
          >
            <div className="grid grid-cols-[2rem,calc(100%-2rem)] items-center max-w-full">
              <div className="w-10">
                {presentation.highlight ? (
                  <ChevronRight className="h-7 w-7 p-1 -translate-x-1 bg-yellow-300 rounded-full" />
                ) : null}
              </div>
              <div className="w-full">
                <h3 className="w-full text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  <HighlightSearch text={presentation.title} search={search} />
                </h3>
                <h4 className="italic text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  <HighlightSearch text={presentation.authors.join(", ")} search={search} />
                </h4>
              </div>{" "}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HighlightSearch({ text, search }: { text: string; search: string }) {
  return (
    <Highlighter
      highlightClassName="bg-yellow-300 rounded"
      searchWords={[search]}
      autoEscape={true}
      textToHighlight={text}
    />
  );
}
