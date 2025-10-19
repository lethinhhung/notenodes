import { Block } from "./export";

// Validate if the parsed JSON is a valid BlockNote blocks array
export function isValidBlocksArray(data: unknown): data is Block[] {
  if (!Array.isArray(data)) return false;

  // Check if each item has at least a type property
  return data.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      "type" in item &&
      typeof item.type === "string"
  );
}

// Parse JSON file content
export function parseJSONContent(content: string): Block[] {
  try {
    const parsed = JSON.parse(content);

    if (!isValidBlocksArray(parsed)) {
      throw new Error("Invalid BlockNote blocks format");
    }

    return parsed;
  } catch (error) {
    throw new Error(
      `Failed to parse JSON: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// Parse Markdown content and convert to BlockNote blocks
export function parseMarkdownContent(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Code block
    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;

      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }

      blocks.push({
        type: "codeBlock",
        content: [
          {
            type: "text",
            text: codeLines.join("\n"),
          },
        ],
        props: {
          language: language || "",
        },
      });

      i++; // Skip closing ```
      continue;
    }

    // Heading
    if (line.startsWith("#")) {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        blocks.push({
          type: "heading",
          content: parseInlineContent(text),
          props: {
            level,
          },
        });
        i++;
        continue;
      }
    }

    // Bullet list item
    if (line.match(/^[-*]\s+/)) {
      const text = line.replace(/^[-*]\s+/, "");
      blocks.push({
        type: "bulletListItem",
        content: parseInlineContent(text),
      });
      i++;
      continue;
    }

    // Numbered list item
    if (line.match(/^\d+\.\s+/)) {
      const text = line.replace(/^\d+\.\s+/, "");
      blocks.push({
        type: "numberedListItem",
        content: parseInlineContent(text),
      });
      i++;
      continue;
    }

    // Paragraph (default)
    blocks.push({
      type: "paragraph",
      content: parseInlineContent(line),
    });
    i++;
  }

  return blocks.length > 0 ? blocks : [{ type: "paragraph", content: [] }];
}

// Parse inline content (bold, italic, code, links)
function parseInlineContent(text: string): Block["content"] {
  const content: Block["content"] = [];

  // For simplicity, we'll just handle basic text with styles
  // A more robust solution would use a proper markdown parser
  const segments: Array<{
    text: string;
    start: number;
    end: number;
    styles?: { bold?: boolean; italic?: boolean; code?: boolean };
    link?: { text: string; href: string };
  }> = [];

  // Find bold text
  let boldMatch;
  const boldRegex = /\*\*(.+?)\*\*/g;
  while ((boldMatch = boldRegex.exec(text)) !== null) {
    segments.push({
      text: boldMatch[1],
      start: boldMatch.index,
      end: boldMatch.index + boldMatch[0].length,
      styles: { bold: true },
    });
  }

  // Find italic text
  let italicMatch;
  const italicRegex = /\*(.+?)\*/g;
  while ((italicMatch = italicRegex.exec(text)) !== null) {
    // Make sure it's not part of bold (**text**)
    if (!text.substring(Math.max(0, italicMatch.index - 1), italicMatch.index).includes("*")) {
      segments.push({
        text: italicMatch[1],
        start: italicMatch.index,
        end: italicMatch.index + italicMatch[0].length,
        styles: { italic: true },
      });
    }
  }

  // Find code text
  let codeMatch;
  const codeRegex = /`(.+?)`/g;
  while ((codeMatch = codeRegex.exec(text)) !== null) {
    segments.push({
      text: codeMatch[1],
      start: codeMatch.index,
      end: codeMatch.index + codeMatch[0].length,
      styles: { code: true },
    });
  }

  // Find links
  let linkMatch;
  const linkRegex = /\[(.+?)\]\((.+?)\)/g;
  while ((linkMatch = linkRegex.exec(text)) !== null) {
    segments.push({
      text: linkMatch[1],
      start: linkMatch.index,
      end: linkMatch.index + linkMatch[0].length,
      link: { text: linkMatch[1], href: linkMatch[2] },
    });
  }

  // Sort segments by start position
  segments.sort((a, b) => a.start - b.start);

  // If no special formatting, just return plain text
  if (segments.length === 0) {
    return [{ type: "text", text }];
  }

  // Build content array with plain and styled text
  let currentIndex = 0;
  for (const segment of segments) {
    // Add plain text before this segment
    if (currentIndex < segment.start) {
      const plainText = text.substring(currentIndex, segment.start);
      if (plainText) {
        content.push({ type: "text", text: plainText });
      }
    }

    // Add styled text or link
    if (segment.link) {
      content.push({
        type: "link",
        href: segment.link.href,
        content: [{ type: "text", text: segment.link.text }],
      });
    } else {
      content.push({
        type: "text",
        text: segment.text,
        styles: segment.styles,
      });
    }

    currentIndex = segment.end;
  }

  // Add remaining plain text
  if (currentIndex < text.length) {
    const plainText = text.substring(currentIndex);
    if (plainText) {
      content.push({ type: "text", text: plainText });
    }
  }

  return content.length > 0 ? content : [{ type: "text", text }];
}

// Parse plain text content (each line becomes a paragraph)
export function parsePlainTextContent(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];

  for (const line of lines) {
    // Skip completely empty lines
    if (line.trim() === "") continue;

    blocks.push({
      type: "paragraph",
      content: [
        {
          type: "text",
          text: line,
        },
      ],
    });
  }

  // Return at least one empty paragraph
  return blocks.length > 0 ? blocks : [{ type: "paragraph", content: [] }];
}
