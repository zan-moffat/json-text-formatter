interface DeckData {
    deckName: string;
    legends: string[];
    counts: Record<string, number>;
  }
  
  function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  
  export function formatDeck(jsonText: string): string {
    let parsed: unknown;
  
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      throw new Error("The input is not valid JSON.");
    }
  
    if (!isObject(parsed)) {
      throw new Error("The JSON must contain a deck object.");
    }
  
    const { deckName, legends, counts } = parsed;
  
    if (typeof deckName !== "string" || deckName.trim() === "") {
      throw new Error("The JSON does not contain a valid deckName.");
    }
  
    if (
      !Array.isArray(legends) ||
      !legends.every((legend) => typeof legend === "string")
    ) {
      throw new Error("The JSON does not contain a valid legends list.");
    }
  
    if (!isObject(counts)) {
      throw new Error("The JSON does not contain a valid counts object.");
    }
  
    const countLines = Object.entries(counts).map(([itemName, quantity]) => {
      if (typeof quantity !== "number" || !Number.isFinite(quantity)) {
        throw new Error(`The quantity for ${itemName} is not a valid number.`);
      }
  
      return `${quantity}x ${itemName}`;
    });
  
    const deck: DeckData = {
      deckName,
      legends,
      counts: counts as Record<string, number>,
    };
  
    return [
      `deckName:${deck.deckName}`,
      "legends:",
      deck.legends.join(","),
      "counts:",
      ...countLines,
    ].join("\n");
  }