import React from 'react';

import UserMessage from '../userMessage';

import './index.css';

export default function MessageItem({ messageReal }) {
  if (!messageReal) {
    return null;
  }
  return (
    <div className="d-flex">
      <div className="">
        <img
          width="80"
          height="80"
          src="../assets/bottle2.png"
          alt="bottle bullet point icon"
        ></img>
      </div>

      <div className="messageTag">
        <UserMessage messageReal={messageReal} />
      </div>
    </div>
  );
}

// Sample usage
/*

MessageItem.propTypes = {
    message: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
}*/
