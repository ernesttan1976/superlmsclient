import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ICourse, IUser, ILesson, IDiscussion } from "../models"
import { useApiUrl } from "@refinedev/core";
import { useContext } from "react";
import { useActiveAuthProvider, useGetIdentity } from "@refinedev/core";
import { Avatar, Button, Input, Slider, Typography } from 'antd';
import OpenAiLogo from "../pages/openai.gif"
import TextArea from 'antd/es/input/TextArea';

const { Title, Text } = Typography;

const ChatPage = (props: any) => {

  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const { course_id, discussions_id }: { course_id: number, discussions_id: IDiscussion[] } = props;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IDiscussion[]>(discussions_id);
  const [numTokens, setNumTokens] = useState(266);

  useEffect(() => {
    setMessages(discussions_id);
  }, [discussions_id]);

  const apiUrl = useApiUrl();

  function uniqueId() {
    return Number.parseInt(Array.from(window.crypto.getRandomValues(new Uint32Array(2))).map(n => n.toString(16).padStart(8, '0')).join(''), 16);
  }

  const sendMessage = () => {
    console.log(user)
    axios.post(`${apiUrl}/messages/${course_id}`, { _id: uniqueId(), message, name: user.name, avatar: user.picture })
      .then(res => {
        setMessages([...messages, res.data]);
        //if the text includes @Super, call Open API bot
        if (res.data.text.includes('@Super')) {
          axios.post(`${apiUrl}/messages/openai/${course_id}`, { message: res.data.text, numTokens })
            .then(res => setMessages([...messages,
            {
              _id: uniqueId(),
              text: res.data.text,
              name: "@super",
              avatar: "favicon-32x32.png",
            }]))
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
    setMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: "90%", width: "90%" }}>
      <div style={{ display: 'flex', alignItems: "center", height: "100%", width: "100%" }}><img src={OpenAiLogo} width={40} height={40} />
        <Title level={5}>Talk to Super Bot by mentioning '@super'</Title>
        <div style={{ flex: 1, overflow: 'auto' }}></div>
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.name === user.name ? 'right' : 'left' }}>
            <Text strong style={{ display: 'inline-block', color: 'black', textAlign: message.name === user.name ? 'right' : 'left' }}>{message.name}</Text>
            <p style={{ display: 'inline-block', backgroundColor: message.name === "@super" ? 'purple' : message.name === user ? 'blue' : 'green', color: 'white', borderRadius: '5px', padding: '5px 10px', margin: '5px' }}>
              {message.text}
            </p>
            <Avatar size="small" src={message.avatar} />
          </div>
        ))}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: "flex-end", height: "100%", width: "100%" }}>
          <TextArea
            placeholder="Chat with AI bot and with the learning community"
            autoSize={{ minRows: 3, maxRows: 10 }}
            value={message} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          />
          {/* <Input type="text" value={message} onChange={e => setMessage(e.target.value)} /> */}
          <Button type="primary" onClick={sendMessage}>Send</Button>
        </div>
        <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center', marginTop: '20px' }}>
          <label htmlFor="numTokensSlider" style={{ marginRight: '10px' }}>Number of tokens:</label>
          {/* <input type="range" id="numTokensSlider" min="56" max="2048" step="24" value={numTokens} onChange={e => setNumTokens(Number(e.target.value))} /> */}
          <Slider style={{width: "50%" }} defaultValue={266} tooltip={{ open: false }} 
            onChange={(e: any)=> setNumTokens(Number(e.target.value))}
            min={56} max={2048} step={24} value={numTokens}
            />
          <span style={{ marginLeft: '10px' }}>{numTokens}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
