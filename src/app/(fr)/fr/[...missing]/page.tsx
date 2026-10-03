import { notFound } from "next/navigation";

// Any unknown path in this language tree answers 404 with this tree's not-found page, inside its
// own root layout (html lang="fr", FR shell). Next 14 streams it as an error shell plus the
// RSC payload, so the page is drawn on the client; the 404 status comes from the server.
export default function FRCatchAll() {
  notFound();
}
