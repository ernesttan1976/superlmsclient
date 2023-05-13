import ChatPage from "components/chat.component";
import React, { useState } from "react";
import OpenAiLogo from "../pages/openai.gif";
import {Typography} from "antd";
const { Text } = Typography;

const GeneralChatPage: React.FC = () => {
    return (
        <>
            <img style={{ margin: 8 }} src={OpenAiLogo} width={40} height={40} />
            <Text style={{ fontSize: "1.2rem" }}>{`AI Powered Chat`}</Text><br />
            <ChatPage course_id="645e3627be9c3e378c76495f" title="AI Powered Chat" />
        </>
    )
};

export default GeneralChatPage;

