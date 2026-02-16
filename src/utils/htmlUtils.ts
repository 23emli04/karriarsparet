/**
 * Strip HTML tags and normalize whitespace to plain text.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Returns plain text from content that may contain HTML.
 */
export function toPlainText(content: string | null | undefined): string {
  if (!content) return "";
  return (content.includes("<") ? stripHtml(content) : content).trim();
}
