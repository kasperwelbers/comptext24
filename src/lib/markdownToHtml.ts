import { remark } from "remark";
import html from "remark-html";
import remarkGFM from "remark-gfm";

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).use(remarkGFM).process(markdown);
  return result.toString();
}
