import { SlideContent } from "../types";

/**
 * Extracts SBAR or Pharmacist Communication Note section from markdown
 */
export function extractSbarNote(markdown: string): string | null {
  const sbarRegex = /(?:####?\s*(?:Pharmacist communication note|SBAR Communication Note|SBAR Note|Pharmacist Intervention Note))([\s\S]*?)(?:####?\s*Evidence|####?\s*Seed evidence base|$)/i;
  const match = markdown.match(sbarRegex);
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Fallback: look for SBAR sections (Situation, Background, Assessment, Recommendation)
  const situationMatch = /(?:Situation:[\s\S]*?Recommendation:[\s\S]*?)(?:####|$)/i;
  const match2 = markdown.match(situationMatch);
  if (match2) {
    return match2[0].trim();
  }

  return null;
}

/**
 * Checks if text is an interactive teaching deck (e.g. contains Slide 1, Slide 2, etc.)
 */
export function isTeachingDeck(markdown: string): boolean {
  return /Slide\s*1\s*:/i.test(markdown) || /###?\s*Slide\s*1/i.test(markdown) || /\*\*Slide\s*1/i.test(markdown);
}

/**
 * Parses markdown into individual structured slides for presentation mode
 */
export function parseTeachingDeck(markdown: string): SlideContent[] {
  const slides: SlideContent[] = [];
  
  // Split by slide headers
  const slideChunks = markdown.split(/(?=(?:###?\s*Slide\s*\d+|(?:\*\*Slide\s*\d+)|(?:Slide\s*\d+\s*:)))/i);

  let slideIndex = 1;
  for (const chunk of slideChunks) {
    if (!chunk.trim()) continue;
    
    // Check if this chunk is a slide
    const titleMatch = chunk.match(/(?:###?\s*Slide\s*\d+[:\s\-\–]*|\*\*Slide\s*\d+[:\s\-\–]*|Slide\s*\d+[:\s\-\–]*)([^\n\r*]+)/i);
    const title = titleMatch ? titleMatch[1].replace(/\*\*/g, "").trim() : `Slide ${slideIndex}`;

    // Extract bullets
    const bulletLines = chunk
      .split("\n")
      .filter((line) => line.trim().startsWith("- ") || line.trim().startsWith("* ") || /^\d+\.\s/.test(line.trim()))
      .map((line) => line.trim().replace(/^[-*]\s+|\d+\.\s+/, ""))
      .filter((line) => !line.toLowerCase().startsWith("speaker notes") && !line.toLowerCase().startsWith("audience question"));

    // Extract speaker notes
    const speakerNotesMatch = chunk.match(/(?:Speaker\s*Notes?|Notes? for presenter)[:\s]*([\s\S]*?)(?:Audience\s*Question|Correct\s*Answer|Evidence|Slide|\n\n\n|$)/i);
    const speakerNotes = speakerNotesMatch ? speakerNotesMatch[1].trim() : undefined;

    // Extract audience question
    const audienceQuestionMatch = chunk.match(/(?:Audience\s*(?:Question|Poll))[:\s]*([\s\S]*?)(?:Correct\s*Answer|Rationale|Evidence|Slide|\n\n\n|$)/i);
    const audienceQuestion = audienceQuestionMatch ? audienceQuestionMatch[1].trim() : undefined;

    // Extract answer and rationale
    const answerMatch = chunk.match(/(?:Correct\s*(?:Answer|Rationale)|Answer\s*(?:Reveal|Rationale))[:\s]*([\s\S]*?)(?:Evidence|Slide|\n\n\n|$)/i);
    const answerRationale = answerMatch ? answerMatch[1].trim() : undefined;

    // Extract evidence citation
    const evidenceMatch = chunk.match(/(?:Evidence\s*(?:Citation|Reference))[:\s]*([\s\S]*?)(?:Slide|\n\n\n|$)/i);
    const evidenceCitation = evidenceMatch ? evidenceMatch[1].trim() : undefined;

    // Extract visual or table
    const visualMatch = chunk.match(/(?:Suggested\s*(?:Visual|Table|Layout))[:\s]*([^\n\r]+)/i);
    const visualOrTable = visualMatch ? visualMatch[1].trim() : undefined;

    slides.push({
      slideNumber: slideIndex,
      title,
      bullets: bulletLines.slice(0, 6),
      visualOrTable,
      speakerNotes,
      audienceQuestion,
      answerRationale,
      evidenceCitation,
    });

    slideIndex++;
  }

  return slides;
}
