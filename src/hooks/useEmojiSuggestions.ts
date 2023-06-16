import { useCallback, useMemo, useState } from "react";
import type { RefObject } from 'react';
import { Input, ShortCode, Suggestion } from "../types/emoji-types";

import Trie from "../classes/Trie";
import { useDebounce } from "./utils";

import data from 'emojibase-data/en/shortcodes/emojibase.json';
import em from 'emojibase-data/en/compact.json';

const EMOJI_SHORT_CODE = /[^a-zA-Z_]/gi;

function cleanString(s: string): ShortCode {
  return s.replace(EMOJI_SHORT_CODE, '')
}

export function useEmojiSuggestions(value: string, inputRef: RefObject<Input>) 
: [Suggestion[], () => void]{
  const [emojies, setEmojies] = useState<Suggestion[]>([]);

  const trie = useMemo(() => {
    const emojiTrie = new Trie();

    Object.entries(data).forEach(([k, v]) => {
      // get emoji for hexcode
      const emoji = em.find(e => e.hexcode === k);

      if (!emoji) {
        return;
      }

      // insert into trrie
      if (Array.isArray(v)) {
        v.forEach(s => emojiTrie.insert(cleanString(s), emoji.unicode));
        return;
      } 
      
      emojiTrie.insert(cleanString(v), emoji?.unicode)
    });

    return emojiTrie;
  }, []);

  const getWord = useCallback((value: string) => {
    if (!inputRef?.current?.selectionStart) {
      return '';
    }

    // split at selctionStart
    const splitString = value
      .substring(0, inputRef.current.selectionStart)
      .split(' ');

    const w = splitString[splitString.length - 1];

    if (w.charAt(0) !== ':') {
      return '';
    }

    return w;
  }, [inputRef]);

  useDebounce(() => {
    if (!value) {
      return;
    }

    const w = cleanString(getWord(value));

    if ((!w || w.length < 2)) {
      return;
    }

    // use last string as value
    if (!trie || !w) {
      setEmojies([]);
    }

    setEmojies(trie.find(w));
  }, [value, getWord, trie], 200);

  const clear = useCallback(() => {
    setEmojies([]);
  }, [])
  
  return [emojies, clear];
}


