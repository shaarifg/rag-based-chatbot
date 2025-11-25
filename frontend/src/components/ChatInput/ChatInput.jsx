import React, { useState } from 'react';
import './ChatInput.scss';

const ChatInput = ({ onSend, onReset, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    onSend(input.trim());
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input__field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask me anything about recent news..."
        disabled={disabled}
      />
      <button
        type="submit"
        className="chat-input__button"
        disabled={disabled || !input.trim()}
      >
        SEND
      </button>
      <button
        type="button"
        className="chat-input__button reset"
        onClick={onReset}
        disabled={disabled}
      >
        RESET
      </button>
    </form>
  );
};

export default ChatInput;
