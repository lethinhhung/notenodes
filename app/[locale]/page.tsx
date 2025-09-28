import { ModeToggle } from "@/components/mode-toggle";
import { Editor } from "@/components/editor";
import { LanguageToggle } from "@/components/language-toggle";
import { getEditorTranslations } from "@/lib/editor-translations";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const translations = await getEditorTranslations(locale);

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <ModeToggle />
        <LanguageToggle />
      </div>
      <Editor translations={translations} />
    </div>
  );
}
