import type { Metadata } from "next";
import ContactPageView, { buildContactMetadata } from "@/components/ContactPageView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return buildContactMetadata(lang, "contacto");
}

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = "es" } = await params;
  return <ContactPageView lang={lang} />;
}

