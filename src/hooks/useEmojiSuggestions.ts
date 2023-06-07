import { useEffect, useMemo, useRef, useState } from "react";
import Trie from "../classes/Trie";
import data from 'emojibase-data/en/shortcodes/emojibase.json';
import em from 'emojibase-data/en/compact.json';

export function useRenderCount() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  return renderCount.current;
}

export function useEmojiSuggestions(value: string) {
  const [emojies, setEmojies] = useState<[string, string][]>([]);

  const trie = useMemo(() => {
    const emojiTrie = new Trie();
    console.time('setup');
    Object.entries(data).forEach(([k, v]) => {
      // get emoji for hexcode
      const emoji = em.find(e => e.hexcode === k);
      if (!emoji) {
        return;
      }
      // insert into trrie
      if (Array.isArray(v)) {
        v.forEach(s => {
          //const c = s.replace(/[^a-zA-Z]/gi, '');
          emojiTrie.insert(s.replace(/[^a-zA-Z_]/gi, ''), emoji.unicode)
        });
      } else {
        // const c = v.replace(/[^a-zA-Z]/gi, '');
        emojiTrie.insert(v.replace(/[^a-zA-Z_]/gi, ''), emoji?.unicode)
      }
    })
    console.timeEnd('setup');
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
    let timeout: number;
    const debounce = (cb: () => void) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        cb();
      }, 100);
    }

    debounce(() => {
      const w = getWord(value);
      // use last string as value
      if (!trie || !w) {
        setEmojies([]);
      }

      console.log('value: ', w.replace(/[^a-zA-Z_]/gi, ''));
      console.time('find')
      const emojies = trie.find(w.replace(/[^a-zA-Z_]/gi, ''));
      console.timeEnd('find')

      setEmojies(emojies);
    })

    return () => {
      clearTimeout(timeout);
    }
  }, [value, trie]);
  
  return emojies;
}


