/* eslint-disable react/no-array-index-key */
import React, { Component } from "react";
import styled from "styled-components";
import Message from "./Message";

const ChatContainer = styled.div``;

class Messages extends Component {
  render() {
    const { messages } = this.props;
    return messages.map((message, i) => (
      <ChatContainer
        className={`messages__item ${message.bigBoxClass}`}
        key={i}
      >
        <Message
          text={message.text}
          userName={message.userName}
          boxClass={`messages__box ${message.boxClass}`}
        />
      </ChatContainer>
    ));
  }
}

export default Messages;
