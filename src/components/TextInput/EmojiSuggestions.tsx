import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useEmojiSuggestions } from '../../hooks/useEmojiSuggestions';

type EmojiSuggestionsProps = {
  value: string;
  textAreaRef: RefObject<HTMLTextAreaElement>;
  updateValue: (newValue: string) => void;
}

enum Action {
  UP = 1,
  DOWN = -1,
}

function EmojiSuggestions({ value, updateValue, textAreaRef: ref}: EmojiSuggestionsProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [selected, setSelected] = useState<[[string, string], number] | null>();
  const suggestions = useEmojiSuggestions(value);

  function scrollIntoView(block: ScrollLogicalPosition) {
    const el = listRef.current?.querySelector('.emoji-btn.active');
    if (el) {
      el?.scrollIntoView({ block });
    }
  }

  const updateText = useCallback((unicode: string): void => {
    const newValue = value.split(' ');

    if (newValue[newValue.length - 1].charAt(0) !== ':') {
      return;
    }

    // remove last word 
    newValue.pop();

    // add unicode to arr 
    newValue.push(unicode);

    // update value
    updateValue(newValue.join(' '));

    // clear selected 
    setSelected(null);

    // focus back on the text input
    ref.current?.setSelectionRange(newValue.length, newValue.length);
    ref.current?.focus();
  }, [value, updateValue, ref]);

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
    scrollIntoView(scroll);
  }, [selected, suggestions])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const unicode = (e.target as HTMLButtonElement).value;
    updateText(unicode);
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
  }, [suggestions, suggestions?.length])

  return (
    <div className='emoji-container'>
      <ul ref={listRef} className='emoji-list'>
        {suggestions?.map(([emoji, name]) => (
          // list like github or grid with emoji name in header for hovered emoji
          <li className='emoji-list-item' key={name}>
            <button
              value={emoji}
              className={`emoji-btn ${selected?.[0]?.[1] === name ? 'active' : ''}`}
              type="button"
              onClick={handleClick}
            >
              {emoji}
              {' '}
              :{name}:
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EmojiSuggestions
