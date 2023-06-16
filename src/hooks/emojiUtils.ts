import {  useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { Emoji, Suggestion, Input, SuggestionIndex, SetValue, OnClose, KeyboardControlReturn } from "../types/emoji-types";

enum Action {
  UP = 1,
  DOWN = -1,
}

export function useKeyboardControls(
  suggestions: Suggestion[], 
  input: RefObject<Input>, 
  container: RefObject<HTMLUListElement>,
  setValue: SetValue,
  onClose: OnClose,
): KeyboardControlReturn  {

  const [selected, setSelected] = useState<Suggestion | null>(null);
  const idxRef = useRef<SuggestionIndex>(-1);
  const savedSetValue = useRef(setValue);
  const savedOnClose = useRef(onClose);

  useEffect(() => {
    savedSetValue.current = setValue;
  }, [setValue]);

  useEffect(() => {
    savedOnClose.current = onClose; 
  }, [onClose]);

  const clear = () => {
    idxRef.current = -1;
    setSelected(null);
  };

  const reset = useCallback(() => {
    idxRef.current = 0;
    setSelected(suggestions[0]);
  }, [suggestions]);

  const handleEnter = useCallback(() => {
    if (!selected?.length || !input.current?.selectionStart) {
      return; 
    }
    savedSetValue.current(selected[0], input.current?.selectionStart);
    clear();
    savedOnClose.current();
  }, [savedSetValue, selected, input]);

  const handleMove = useCallback((action: Action) => {
    if (!selected?.length) {
      reset();
      return;
    }
    
    const [limit, scroll]: [number, ScrollLogicalPosition] = action === Action.DOWN 
      ? [0, 'center'] 
      : [suggestions.length - 1, 'start'];

    const next = idxRef.current + action.valueOf();

    if (action === Action.DOWN ? (next < limit) : (next > limit)) {
      return;
    }

    setSelected(suggestions[next]);
    idxRef.current = next;

    if (container.current && container.current.clientHeight !== container.current.scrollHeight) {
      container.current
        ?.querySelector('.emoji-btn.active')
        ?.scrollIntoView({ block: scroll, inline: 'start' });
    }

  }, [reset, selected, suggestions, container]);

  const handleEscape = useCallback(() => {
    clear();
    savedOnClose.current();
  }, []) 

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
        e.preventDefault();
        handleMove(Action.UP);
        break;
      case 'Escape':
        e.preventDefault();
        handleEscape();
        break;
      default: 
        return;
    }
  }, [handleEnter, handleMove, handleEscape, suggestions?.length]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const setSelectedCallback = (val: Suggestion | null) => {
    if (!val) {
      idxRef.current = -1;
    }

    setSelected(val);
  }

  return [selected, setSelectedCallback, reset];
}

function isLastWordShortCode(arr: string[]): boolean {
  return arr[arr.length - 1].charAt(0) !== ':'
}

export function useUpdateText(
  value: string, input: RefObject<Input>
): (unicode: Emoji, pos: number) => string {
  const updatedAt = useRef<number>(-1);

  useEffect(() => {
    if (updatedAt.current < 0 || !input.current) {
      return;
    }

    input?.current?.setSelectionRange(updatedAt.current, updatedAt.current);
    input?.current?.focus();

    updatedAt.current = -1;
  }, [value, input])

  return useCallback((unicode: Emoji, pos: number): string => {
    if (isNaN(pos)) {
      return value;
    }

    const beforeCursor = value
      .substring(0, pos)
      .split(' ');

    const afterCursor = value.substring(pos);

    // if last word is short code
    if (isLastWordShortCode(beforeCursor)) {
      return value;
    }

    // replace shortcode with unicode 
    beforeCursor.pop();
    beforeCursor.push(unicode);
    const newBeforeCursor = beforeCursor.join(' ');

    // indicator to update set slection range
    updatedAt.current = newBeforeCursor.length;
    return newBeforeCursor + afterCursor;
  }, [value]);
}

