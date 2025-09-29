import { ModeToggle } from "@/components/mode-toggle";
import { EditorWrapper } from "@/components/editor-wrapper";
import { LanguageToggle } from "@/components/language-toggle";
import { getEditorTranslations } from "@/lib/editor-translations";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const translations = await getEditorTranslations(locale);

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <ModeToggle />
        <LanguageToggle />
      </div>
      <EditorWrapper translations={translations} />
    </div>
  );
}