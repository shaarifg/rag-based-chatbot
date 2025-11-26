import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Message.scss';

const Message = ({ message, isTyping }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`message ${message.role}`}>
      <div className="message__avatar">
        {message.role === 'user' ? 'U' : 'AI'}
      </div>
      <div className="message__content">
        {isTyping ? (
          <div className="message__typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <>
            <div className="message__markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
            {message.timestamp && (
              <span className="message__time">
                {formatTime(message.timestamp)}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
