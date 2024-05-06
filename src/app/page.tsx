import { load } from "outstatic/server";
import markdownToHtml from "../lib/markdownToHtml";
import PageContent from "./PageContent";
import { Section } from "@/types";
import { promises as fs } from "fs";

export default async function Index() {
  const sections = await getData();
  const program = await getProgram();
  return <PageContent sections={sections} program={program} />;
}

async function getContent(db: any, slug: string): Promise<Section> {
  try {
    const data = await db.find({ collection: "pages", slug }, ["title", "content"]).first();

    return {
      id: slug,
      link: data.title,
      content: await markdownToHtml(data.content),
    };
  } catch (e) {
    console.error(e);
    return { id: slug, link: "", content: "" };
  }
}

async function getProgram(): Promise<Record<string, string | number>[]> {
  const file = await fs.readFile("data/comptext_program.json", "utf-8");
  const program = JSON.parse(file);

  const roomsFile = await fs.readFile("data/comptext_rooms.json", "utf-8");
  const rooms = JSON.parse(roomsFile);

  return program.map((item: Record<string, string | number>) => {
    const room = rooms.find((r: Record<string, string>) => r.session === item.session);
    return {
      ...item,
      room: room ? room.room : "",
    };
  });
}

const keynote = async () => {
  const md = `# Keynote
  
  If you enjoyed the keynote speech, and want to revisit the slides or share them with your collegues, you can download them here.
  `;
  return {
    id: "keynote",
    link: "Keynote",
    content: await markdownToHtml(md),
  };
};

async function getData() {
  const db = await load();

  return [
    await getContent(db, "welcome"),
    await keynote(),
    // await getContent(db, "program"),
    await getContent(db, "sessions"),
    //await getContent(db, "cfp"),
    await getContent(db, "workshops"),
    await getContent(db, "sponsors"),
  ];
}
