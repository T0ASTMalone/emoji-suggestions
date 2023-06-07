import React, { useRef, useState } from 'react'
import EmojiSuggestions from './EmojiSuggestions';

import './TextInput.css';

const TEXT_COLUMNS = 30;

function TextInput() {
  const [value, setValue] = useState<string>('');
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }

  return (
    <>
      <EmojiSuggestions textAreaRef={ref} value={value} updateValue={setValue} />
      <label className="emoji-input-group">
        Emoji Test
        <textarea
          ref={ref}
          onChange={handleChange}
          value={value}
          id="emoji-input" 
          name="emoji-input" 
          cols={TEXT_COLUMNS}
          rows={10}
        />
      </label>
    </>
  )
}

export default TextInput
