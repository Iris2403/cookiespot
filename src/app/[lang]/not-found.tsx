import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";

export default function NotFound() {
  const t = getDictionary("el");
  const en = getDictionary("en");
  return (
    <main id="main" className="not-found">
      <h1 className="display-xl">{t.notFound.title}</h1>
      <p>{t.notFound.text}</p>
      <p lang="en">{en.notFound.text}</p>
      <p><Link href="/el" className="btn btn--primary">{t.notFound.cta}</Link> <Link href="/en" className="btn btn--outline" lang="en">{en.notFound.cta}</Link></p>
    </main>
  );
}
