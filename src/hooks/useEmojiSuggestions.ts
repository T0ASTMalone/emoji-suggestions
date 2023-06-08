import { useEffect, useMemo, useRef, useState } from "react";
import Trie from "../classes/Trie";
import data from 'emojibase-data/en/shortcodes/emojibase.json';
import em from 'emojibase-data/en/compact.json';

export function useRenderCount() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  return renderCount.current;
}

function cleanString(s: string) {
  return s.replace(/[^a-zA-Z_]/gi, '')
}

export function useEmojiSuggestions(value: string) {
  const [emojies, setEmojies] = useState<[string, string][]>([]);

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

  function getWord(value: string) {
    // split string by space
    const words = value.split(' ');
    // get last word
    const w = words[words.length - 1];

    if (w.charAt(0) !== ':') {
      return '';
    }

    return w;
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const debounce = (cb: () => void) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        cb();
      }, 300);
    }

    debounce(() => {
      const w = cleanString(getWord(value));
      // use last string as value
      if (!trie || !w) {
        setEmojies([]);
      }

      setEmojies(trie.find(w));
    })

    return () => {
      clearTimeout(timeout);
    }
  }, [value, trie]);
  
  return emojies;
}


