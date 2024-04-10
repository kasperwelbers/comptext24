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
  return JSON.parse(file);
  console.log(file);
  //const programData = await fetch("/data/comptext_program.json");
  //const program = await programData.json();
  //return program;
}

async function getData() {
  const db = await load();

  return [
    await getContent(db, "welcome"),
    await getContent(db, "program"),
    await getContent(db, "sessions"),
    //await getContent(db, "cfp"),
    await getContent(db, "workshops"),
    await getContent(db, "sponsors"),
  ];
}
