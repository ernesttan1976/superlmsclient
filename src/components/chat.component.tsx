import React, { useState } from 'react';
import axios from 'axios';
import { ICourse, IUser, ILesson, IDiscussion } from "../models"
import { useContext } from "react";
import { useActiveAuthProvider, useGetIdentity } from "@refinedev/core";
import { Avatar, Button, Tooltip, Typography } from 'antd';

import TextArea from 'antd/es/input/TextArea';

import { useQuery, QueryKey, InvalidateOptions } from "@tanstack/react-query"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getCourseNoCache } from 'api/courses';

import { useInvalidate } from "@refinedev/core";
import ReactMarkdown from 'react-markdown';


const { Text } = Typography;
const DATA_URI = (process.env.NODE_ENV === 'production') ? process.env.REACT_APP_PRODUCTION_URI : process.env.REACT_APP_DEV_URI;

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 } }
});

const ChatPage = (props: any) => {
  const { course_id, title }: { course_id: string, title: string } = props;

  const invalidate = useInvalidate();
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });


  const [message, setMessage] = useState('');
  const [numTokens, setNumTokens] = useState(1000);
  const courseQuery = useQuery<ICourse>({
    queryKey: ['courses', course_id],
    queryFn: () => getCourseNoCache(course_id),
    onSuccess: (data) => {
      if (data?.discussions_id) {
        setMessages([...data.discussions_id])
      }
    }
  })
  const { status, isLoading } = courseQuery;
  const [messages, setMessages] = useState<IDiscussion[]>(courseQuery.data?.discussions_id || []);

  if (courseQuery.status === "loading") return <h1>Loading...</h1>;
  if (courseQuery.status === "error") return <h1>{JSON.stringify(courseQuery.error)}</h1>
  if (!courseQuery.data) return <h1>No data!</h1>
  function uniqueId() {
    return Number.parseInt(Array.from(window.crypto.getRandomValues(new Uint32Array(2))).map(n => n.toString(16).padStart(8, '0')).join(''), 16);
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

      }

      invalidate({
        resource: "courses",
        invalidates: ["all"],
      });

    } catch (error) {
      setMessages([...messages, chatMessage])
      setMessage('');

      return { error: error }
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "space-between", width: "90%", height: "calc(100% - 52px)", overflowY: "auto", margin: "0 auto" }}>

        {!(messages.length >= 0) ? <div style={{ display: "flex", width: "100%", height: 200, zIndex: 50 }}>No messages</div> : messages?.map((message, index) => (
          <div key={index} style={{ display: "flex", alignItems: "flex-end", flexDirection: message?.name === user?.name ? 'row-reverse' : 'row', zIndex: 50 }}>
            <Avatar style={{ width: 40, height: 40 }} src={message?.avatar} />
            <div className="message-text"
              style={{
                display: 'inline-block',
                backgroundColor: (message?.name === "@super") ? 'purple' : (message?.name === user?.name) ? 'blue' : 'green',
                color: 'white',
                borderRadius: (message?.name === user?.name) ? "10px 15px 0 15px" : "15px 10px 15px 0px",
                padding: '5px 10px',
                margin: '5px',
                width: '85%'
              }}>
            <ReactMarkdown>
              {`*${message?.name}*\n${message?.text}`}
            </ReactMarkdown></div>
          </div>))}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "space-between", minHeight: 120, width: "100%" }}>
          <Tooltip title="Talk to Super Bot by mentioning '@super'">
            <TextArea
              placeholder="Chat with AI bot, Instructors and the learning community"
              autoSize={{ minRows: 3, maxRows: 10 }}
              size="large"
              style={{ width: "100%", height: 75, marginTop: 8 }}
              value={message} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            />
          </Tooltip><br />
          <Button type="primary" onClick={sendMessage}>Send</Button>
        </div>
        <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center', marginTop: '40px', height: 50 }}>
          <label htmlFor="numTokensSlider" style={{ marginRight: '10px' }}>Number of tokens:</label>
          <input type="range" id="numTokensSlider" min="56" max="2048" step="24" value={numTokens} onChange={e => setNumTokens(Number(e.target.value))} />
          <span style={{ marginLeft: '10px' }}>{numTokens}</span>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default ChatPage;
