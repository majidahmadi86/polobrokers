import Link from "next/link";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

export function NotFoundPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div className="px-[8vw] py-[90px]">
      <h1>{dict.notFound.title}</h1>
      <p className="mt-8">
        <Link href={localePath(locale, "home")} className="btn btn-primary">
          {dict.notFound.back}
        </Link>
      </p>
    </div>
  );
}
