/* eslint-disable react/self-closing-comp */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from "react";
import styled from "styled-components";

const Username = styled.p`
  font-size: 0.8rem;
  font-weight: 700;
  padding: 5px;
`;

const MessageContainer = styled.div`
  width: 200px;
`;

const Text = styled.p`
  font-size: 0.8rem;
  padding: 5px;
`;

class Message extends Component {
  render() {
    const { text, userName, boxClass } = this.props;

    return (
      <MessageContainer>
        <Username>{userName}</Username>
        <Text className={boxClass}>{text}</Text>
      </MessageContainer>
    );
  }
}

export default Message;
