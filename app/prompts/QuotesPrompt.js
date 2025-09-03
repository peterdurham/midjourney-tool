export const quotesPrompt = `I'm looking for quotes for Instagram from ancient works that are punchy and viral.

IMPORTANT: For each quote, either give me: (1) just the direct quote if it's already Instagram-ready, OR (2) both the direct quote AND a paraphrase if the original is clunky. Label any paraphrases clearly as "Original:" and "Paraphrase:"

They should fit on 2-3 lines and be punchy and viral.

Word limits:
* Direct quotes that are already punchy: max 15 words
* Paraphrases of clunky quotes: max 15 words

They should stand alone well and not need additional context, stuff like:
* A coward's weapon never hurts the brave
* Behavior that's admired is the path to power of people everywhere

Requirements:
* Make sure to always include the direct quote - I need to verify them
* Include the book/line number references so I can verify each quote
* Give me 20 of the best options rather than everything you can find
* Prioritize quotes about timeless themes that modern audiences connect with (courage, wisdom, justice, perseverance, etc.)
* Avoid overly specific references to ancient customs or obscure mythology unless they're incredibly powerful
* Unless the quote is a definite banger for instagram/tiktok etc make sure to paraphrase it into a banger quote
* Make absolutely certain the direct quotes actually exist in the text and are at the specified line number/location

Please reply in this JSON format with each quote, preferably in order of appearance:
{
  "text": "original quote goes here",
  "paraphrase": "paraphrased quote if it needs paraphrasing",
  "book": "book number if it exists",
  "line": "line number if available"
}

Can you give me quotes that fit this criteria from the book: `;
