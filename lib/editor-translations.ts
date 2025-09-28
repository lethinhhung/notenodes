import { useTranslation } from "@/lib/i18n";

export interface EditorTranslations {
  titlePlaceholder: string;
  contentPlaceholder: string;
  slashMenu: {
    heading1: { title: string; description: string };
    heading2: { title: string; description: string };
    heading3: { title: string; description: string };
    bulletedList: { title: string; description: string };
    numberedList: { title: string; description: string };
    quote: { title: string; description: string };
    codeBlock: { title: string; description: string };
  };
}

export async function getEditorTranslations(locale: string): Promise<EditorTranslations> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(locale);

  return {
    titlePlaceholder: t("editor.titlePlaceholder"),
    contentPlaceholder: t("editor.contentPlaceholder"),
    slashMenu: {
      heading1: {
        title: t("editor.slashMenu.heading1.title"),
        description: t("editor.slashMenu.heading1.description"),
      },
      heading2: {
        title: t("editor.slashMenu.heading2.title"),
        description: t("editor.slashMenu.heading2.description"),
      },
      heading3: {
        title: t("editor.slashMenu.heading3.title"),
        description: t("editor.slashMenu.heading3.description"),
      },
      bulletedList: {
        title: t("editor.slashMenu.bulletedList.title"),
        description: t("editor.slashMenu.bulletedList.description"),
      },
      numberedList: {
        title: t("editor.slashMenu.numberedList.title"),
        description: t("editor.slashMenu.numberedList.description"),
      },
      quote: {
        title: t("editor.slashMenu.quote.title"),
        description: t("editor.slashMenu.quote.description"),
      },
      codeBlock: {
        title: t("editor.slashMenu.codeBlock.title"),
        description: t("editor.slashMenu.codeBlock.description"),
      },
    },
  };
}