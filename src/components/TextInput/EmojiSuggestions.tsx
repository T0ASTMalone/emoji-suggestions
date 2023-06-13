import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import EmojiSuggestion from './EmojiSuggestion';

import { useEmojiSuggestions } from '../../hooks/useEmojiSuggestions';

type EmojiSuggestionsProps = {
  value: string;
  inputRef: RefObject<HTMLTextAreaElement | HTMLInputElement>;
  updateValue: (newValue: string) => void;
}

enum Action {
  UP = 1,
  DOWN = -1,
}

function isLastWordShortCode(arr: string[]) {
  return arr[arr.length - 1].charAt(0) !== ':'
}

function EmojiSuggestions({ value, updateValue, inputRef }: EmojiSuggestionsProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const updatedAt = useRef<number>(-1);
  const [selected, setSelected] = useState<[[string, string], number] | null>();

  const suggestions = useEmojiSuggestions(value, inputRef);

  const updateText = useCallback((unicode: string): void => {
    // split string at cursor
    if (!inputRef?.current?.selectionStart) {
      return;
    }

    const beforeCursor = value
      .substring(0, inputRef.current.selectionStart)
      .split(' ');
    const postCursor = value.substring(inputRef.current.selectionStart);

    // if last word is short code
    if (isLastWordShortCode(beforeCursor)) {
      return;
    }

    // replace shortcode with unicode 
    beforeCursor.pop();
    beforeCursor.push(unicode);
    const newBeforeCursor = beforeCursor.join(' ');
    updateValue(newBeforeCursor + postCursor);

    // clear selected 
    setSelected(null);

    // indicator to update set slection range
    updatedAt.current = newBeforeCursor.length;
  }, [value, updateValue, inputRef]);

  useEffect(() => {
    // check indicator here 
    if (updatedAt.current < 0 || !inputRef.current) {
      return;
    }

    inputRef?.current?.setSelectionRange(updatedAt.current, updatedAt.current);
    inputRef?.current?.focus();

    updatedAt.current = -1;
  }, [value, inputRef])

  const handleEnter = useCallback(() => {
    if (!selected?.length) {
      return; 
    }
    updateText(selected[0][0]);
    setSelected(null);
  }, [updateText, selected]);

  const handleMove = useCallback((action: Action) => {
    if (!selected?.length) {
      setSelected([suggestions[0], 0]);
      return;
    }
    
    const [limit, scroll]: [number, ScrollLogicalPosition] = action === Action.DOWN 
      ? [0, 'center'] 
      : [suggestions.length - 1, 'start'];

    const next = selected[1] + action.valueOf();

    if (action === Action.DOWN ? (next < limit) : (next > limit)) {
      return;
    }

    setSelected([...[suggestions[next], next] as [[string, string], number]]);

    listRef.current
      ?.querySelector('.emoji-btn.active')
      ?.scrollIntoView({ block: scroll });
  }, [selected, suggestions])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    updateText((e.target as HTMLButtonElement).value);
    setSelected(null);
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!suggestions?.length) {
      return;
    }

    switch(e.code) { 
      case 'Enter': 
        e.preventDefault();
        handleEnter();
        break;
      case 'ArrowUp': 
        e.preventDefault();
        handleMove(Action.DOWN);
        break;
      case 'ArrowDown': 
        e.preventDefault()
        handleMove(Action.UP);
        break;
      case 'Escape':
        break;
      default: 
        return;
    }
  }, [handleEnter, handleMove, suggestions?.length]);

  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    // when sugestions change update selected 
    setSelected([suggestions[0], 0]);
  }, [suggestions, suggestions?.length]);

  return (
    <div className='emoji-container'>
      <ul ref={listRef} className='emoji-list'>
        {suggestions?.map(([emoji, name]) => (
          <EmojiSuggestion 
            key={name}
            selected={selected?.[0]?.[1] === name }
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
