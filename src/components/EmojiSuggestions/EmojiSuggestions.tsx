import React, { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'; 
import type { Input } from '../../types/emoji-types';
import { EmojiSuggestion } from '../EmojiSuggestion';

import { useEmojiSuggestions } from '../../hooks/useEmojiSuggestions';
import { useClickOutside } from '../../hooks/utils';
import { useKeyboardControls, useUpdateText } from '../../hooks/emojiUtils';

import './EmojiSuggestions.css';

export type EmojiSuggestionsProps = {
  value: string;
  inputRef: RefObject<Input>;
  updateValue: (newValue: string) => void;
}

function EmojiSuggestions({ value, updateValue, inputRef }: EmojiSuggestionsProps) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [suggestions, clearEmojies] = useEmojiSuggestions(value, inputRef);
  const updateText = useUpdateText(value, inputRef);
  // const count = useRenderCount();
 
  // arrow keys, enter, escape 
  const [selected, setSelected, reset] = useKeyboardControls(
    suggestions, 
    inputRef, 
    listRef, 
    (value: string, start: number) => updateValue(updateText(value, start)), 
    () => { setOpen(false), clearEmojies() },
  );

  // close when click outside
  const ref = useClickOutside<HTMLDivElement>(() => {
    // only run if not open and to prevent re renders
    if (!open && !selected?.length) {
      return;
    }

    setSelected(null);
    setOpen(false);
    clearEmojies();
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!inputRef.current?.selectionStart) {
      return;
    }
    updateValue(
      updateText((e.target as HTMLButtonElement).value, inputRef.current?.selectionStart)
    );

    setSelected(null);
    setOpen(false);
    clearEmojies();
  }

  useEffect(() => {
    if (!suggestions?.length) {
      return;
    }
    reset();
    setOpen(true)
  }, [suggestions, suggestions?.length, reset]);


  return (
    <div ref={ref} className='emoji-container'>
      <ul ref={listRef} className='emoji-list'>
        {open && suggestions?.map(([emoji, name]) => (
          <EmojiSuggestion
            key={name}
            selected={selected?.[1] === name}
            emoji={emoji}
            name={name}
            handleClick={handleClick}
          />
        ))}
      </ul>
    </div>
  )
}

export default EmojiSuggestions
