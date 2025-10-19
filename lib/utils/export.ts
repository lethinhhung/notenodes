export interface Block {
  type: string;
  content?: Content[];
  props?: Record<string, unknown>;
}

interface Content {
  type: string;
  text?: string;
  styles?: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
  };
  href?: string;
  content?: Content[];
}

// Simple converter from BlockNote blocks to Markdown
export function blocksToMarkdown(blocks: Block[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      const type = block.type;
      const content = Array.isArray(block.content) ? block.content : [];

      // Extract text from inline content
      const text = content
        .map((item: Content) => {
          if (item.type === "text") {
            let txt = item.text || "";
            // Apply text styles
            if (item.styles?.bold) txt = `**${txt}**`;
            if (item.styles?.italic) txt = `*${txt}*`;
            if (item.styles?.code) txt = `\`${txt}\``;
            return txt;
          }
          if (item.type === "link") {
            return `[${item.content?.[0]?.text || ""}](${item.href || ""})`;
          }
          return "";
        })
        .join("");

      // Convert based on block type
      switch (type) {
        case "heading": {
          const level = (block.props?.level as number) || 1;
          return "#".repeat(level) + " " + text;
        }
        case "bulletListItem":
          return "- " + text;
        case "numberedListItem":
          return "1. " + text;
        case "codeBlock": {
          const language = (block.props?.language as string) || "";
          return "```" + language + "\n" + text + "\n```";
        }
        case "paragraph":
        default:
          return text;
      }
    })
    .join("\n\n");
}

// Simple converter from BlockNote blocks to HTML
export function blocksToHTML(blocks: Block[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  const htmlBlocks = blocks
    .map((block) => {
      const type = block.type;
      const content = Array.isArray(block.content) ? block.content : [];

      // Extract HTML from inline content
      const htmlText = content
        .map((item: Content) => {
          if (item.type === "text") {
            let txt = item.text || "";
            // Escape HTML
            txt = txt
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            // Apply text styles
            if (item.styles?.bold) txt = `<strong>${txt}</strong>`;
            if (item.styles?.italic) txt = `<em>${txt}</em>`;
            if (item.styles?.code) txt = `<code>${txt}</code>`;
            return txt;
          }
          if (item.type === "link") {
            const linkText = item.content?.[0]?.text || "";
            return `<a href="${item.href || ""}">${linkText}</a>`;
          }
          return "";
        })
        .join("");

      // Convert based on block type
      switch (type) {
        case "heading": {
          const level = (block.props?.level as number) || 1;
          return `<h${level}>${htmlText}</h${level}>`;
        }
        case "bulletListItem":
          return `<li>${htmlText}</li>`;
        case "numberedListItem":
          return `<li>${htmlText}</li>`;
        case "codeBlock": {
          const language = (block.props?.language as string) || "";
          return `<pre><code class="language-${language}">${htmlText}</code></pre>`;
        }
        case "paragraph":
        default:
          return `<p>${htmlText}</p>`;
      }
    })
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Note</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    code {
      background: #f4f4f4;
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }
    pre {
      background: #f4f4f4;
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
  </style>
</head>
<body>
${htmlBlocks}
</body>
</html>`;
}

// Simple converter from BlockNote blocks to plain text
export function blocksToPlainText(blocks: Block[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      const content = Array.isArray(block.content) ? block.content : [];

      // Extract plain text from inline content
      const text = content
        .map((item: Content) => {
          if (item.type === "text") {
            return item.text || "";
          }
          if (item.type === "link") {
            // For plain text, just return the link text (not the URL)
            return item.content?.[0]?.text || "";
          }
          return "";
        })
        .join("");

      return text;
    })
    .join("\n");
}