/**
  * unicode value for emoji
  *
  * Example: 🧪 
  */
export type Emoji = string;
/**
  * Short code for emoji
  *
  * Example: `:test_tube:`
  */
export type ShortCode = string;
export type SuggestionIndex = number;
/**
  * [Emoji, ShortCode]
  *
  * Emoji - unicode emoji string
  * ShortCode - emoji shortcode strings
  */
export type Suggestion = [Emoji, ShortCode];
export type Input = HTMLInputElement | HTMLTextAreaElement;

export type SetValue = (val: Emoji, start: number) => void;
export type OnClose = () => void;
export type SetValueCallback = (val: Suggestion | null) => void;
export type KeyboardControlReturn  = [Suggestion | null, SetValueCallback, OnClose];
