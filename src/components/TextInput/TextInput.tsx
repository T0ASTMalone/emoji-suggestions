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

  const [val, setVal] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  }

  return (
    <>
      <EmojiSuggestions inputRef={ref} value={value} updateValue={setValue} />
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
      <EmojiSuggestions inputRef={inputRef} value={val} updateValue={setVal} />
      <label className="emoji-input-group" htmlFor="">
        Emoji Test Input
        <input 
          id="emoji-input" 
          type="text" 
          name="emoji-input" 
          ref={inputRef} 
          value={val}
          onChange={handleChangeInput}
        />
      </label>
    </>
  )
}

export default TextInput
