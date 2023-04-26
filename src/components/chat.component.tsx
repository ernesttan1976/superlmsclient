import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ICourse, IUser, ILesson, IDiscussion } from "../models"
import { useContext } from "react";
import { useActiveAuthProvider, useGetIdentity } from "@refinedev/core";
import { Avatar, Button, Input, Slider, Tooltip, Typography } from 'antd';

import TextArea from 'antd/es/input/TextArea';
import { useInvalidate } from "@refinedev/core";

const { Title, Text } = Typography;
const DATA_URI = (process.env.NODE_ENV === 'production') ? process.env.REACT_APP_PRODUCTION_URI : process.env.REACT_APP_DEV_URI;

const ChatPage = (props: any) => {

  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const { course_id, discussions_id, title }: { course_id: number, discussions_id: IDiscussion[], title: string } = props;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IDiscussion[]>(discussions_id);
  const [numTokens, setNumTokens] = useState(266);
  const [messageBoard, setMessageBoard] = useState(<></>);

  const invalidate = useInvalidate();
  useEffect(() => {
    if(!user) return
    setMessageBoard(
      <>
        {messages?.map((message, index) => (
          <div key={index} style={{ display: "flex", alignItems: "flex-end", flexDirection: message?.name === user?.name ? 'row-reverse' : 'row' }}>
            <Avatar size={40} src={message?.avatar} />
            <p style={{
              display: 'inline-block',
              backgroundColor: (message?.name === "@super") ? 'purple' : (message?.name === user?.name) ? 'blue' : 'green',
              color: 'white',
              borderRadius: (message?.name === user?.name) ?  "10px 15px 0 15px" : "15px 10px 15px 0px",
              padding: '5px 10px',
              margin: '5px'
            }}><Text italic strong
            style={{
              display: 'inline-block',
              color: 'black',
              textAlign: (message?.name === user?.name) ? 'right' : 'left'
            }}>{message?.name}</Text><br/>{message?.text}</p>
          </div>))}</>)
  }, [messages, discussions_id])

  function uniqueId() {
    return Number.parseInt(Array.from(window.crypto.getRandomValues(new Uint32Array(2))).map(n => n.toString(16).padStart(8, '0')).join(''), 16);
  }

  function refreshInvalidate(){
    invalidate({
      resource: "courses",
      invalidates: ["all"],
    });
  }

  const sendMessage = async () => {
    const chatMessage = { text: message, name: user?.name, avatar: user?.picture };
    try {
      
      if (!user) return
      if (!message) return
      //_id: uniqueId()
      
      const res = await axios.post(`${DATA_URI}/messages/${course_id}`, chatMessage)
      if (!res) return
      setMessages([...messages, chatMessage])
      setMessage('');

      //if the text includes @super, call Open API bot
      if (message.includes('@super')) {
        const newMessage = message.replace('@super', '');
        const res2 = await axios.post(`${DATA_URI}/messages/openai/${course_id}`, { text: newMessage, context: title, numTokens })
        if (!res2) return
        console.log(res2)
        // setMessages([...messages, ])
          
      }
      refreshInvalidate();

    } catch (error) {
      refreshInvalidate();
      setMessages([...messages, chatMessage])
      setMessage('');

      return { error: error }
    }
  }




  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", width: "100%", overflowY: "auto" }}>
      <div style={{ width: "100%", flex: 1 }}>
        {messageBoard}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "space-between", height: 120, width: "100%" }}>
          <Tooltip title="Talk to Super Bot by mentioning '@super'">
            <TextArea
              placeholder="Chat with AI bot and with the learning community"
              autoSize={{ minRows: 3, maxRows: 10}}
              size="large"
              style={{ width: "100%", height: 75, marginTop: 8 }}
              value={message} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            />
          </Tooltip><br/>
          <Button type="primary" onClick={sendMessage}>Send</Button>
        </div>
        <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center', marginTop: '40px', height: 50 }}>
          <label htmlFor="numTokensSlider" style={{ marginRight: '10px' }}>Number of tokens:</label>
          <input type="range" id="numTokensSlider" min="56" max="2048" step="24" value={numTokens} onChange={e => setNumTokens(Number(e.target.value))} />
          {/* <Slider style={{ width: "50%" }} defaultValue={266} tooltip={{ open: false }}
              onChange={(e: any) => setNumTokens(Number(e.target.value))}
              min={56} max={2048} step={24} value={numTokens}
            /> */}
          <span style={{ marginLeft: '10px' }}>{numTokens}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
