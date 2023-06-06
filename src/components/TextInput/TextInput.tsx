import React, { useState } from 'react'
import { useEmojiSuggestions } from '../../hooks/useEmojiSuggestions';

const formGroup: React.CSSProperties = {
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'start',
  marginBottom: '10px',
}

function TextInput() {
  const [value, setValue] = useState<string>('');
  useEmojiSuggestions(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  return (
    <label style={formGroup}>
      Emoji Test
      <input
        onChange={handleChange}
        value={value}
        id="emoji-input" 
        type="text" 
        name="emoji-input" 
      />
    </label>
  )
}

export default TextInput
