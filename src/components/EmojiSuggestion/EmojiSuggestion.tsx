import React from 'react'
import type { Emoji, ShortCode } from '../../types/emoji-types';

type EmojiSuggestionProps  = {
  name: ShortCode;
  selected: boolean;
  emoji: Emoji;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function EmojiSuggestion({ name, selected, emoji, handleClick }: EmojiSuggestionProps) {
  return (
    // list like github or grid with emoji name in header for hovered emoji
    <li className='emoji-list-item' key={name}>
      <button
        value={emoji}
        className={`emoji-btn ${selected ? 'active' : ''}`}
        type="button"
        onClick={handleClick}
      >
        {emoji}
        {' '}
        :{name}:
      </button>
    </li>
  )
}

export default EmojiSuggestion
