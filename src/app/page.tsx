import { load } from "outstatic/server";
import markdownToHtml from "../lib/markdownToHtml";
import PageContent from "./PageContent";
import { Section } from "@/types";

export default async function Index() {
  const sections = await getData();

  return <PageContent sections={sections} />;
}

async function getContent(db: any, slug: string): Promise<Section> {
  try {
    const data = await db
      .find({ collection: "pages", slug }, ["title", "content"])
      .first();

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

async function getData() {
  const db = await load();

  return [
    await getContent(db, "welcome"),
    await getContent(db, "cfp"),
    await getContent(db, "program"),
    // await getContent(db, "workshops"),
    // await getContent(db, "sponsors"),
  ];
}
