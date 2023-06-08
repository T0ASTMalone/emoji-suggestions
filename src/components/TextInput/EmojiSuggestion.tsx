import React from 'react'

type EmojiSuggestionProps  = {
  name: string;
  selected: boolean;
  emoji: string;
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
