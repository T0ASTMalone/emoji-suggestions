import { useEffect, useMemo } from "react";
import Trie from "../classes/Trie";
import data from 'emojibase-data/en/shortcodes/cldr.json';
import em from 'emojibase-data/en/compact.json';

export function useEmojiSuggestions(value: string) {
  const trie = useMemo(() => {
    console.log(data);
    const emojiTrie = new Trie();
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
          emojiTrie.insert(s.replace(/[^a-zA-Z]/gi, ''), emoji.unicode)
        });
      } else {
        // const c = v.replace(/[^a-zA-Z]/gi, '');
        emojiTrie.insert(v.replace(/[^a-zA-Z]/gi, ''), emoji?.unicode)
      }
    })
    return emojiTrie;
  }, []);

  useEffect(() => {
    if (!trie) {
      return;
    }

    // console.log(trie);
    const emojies = trie.find("check");
    console.log(emojies);
  }, [trie])
}
