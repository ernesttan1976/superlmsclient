import { useResource } from "@refinedev/core";
import ReactPlayer from 'react-player'
import dayjs from "dayjs";

import { Checkbox, Col, Collapse, Drawer, FloatButton, InputRef, List, Row, Space, Typography } from "antd";
import { ICourse, IUser, ILesson, IDiscussion } from "../models"
import { StarOutlined, LikeOutlined, MessageOutlined, PlaySquareOutlined, QuestionCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import React, { useCallback, useRef, useState } from "react";
import { getCourse } from "api/courses";
import { useQuery } from "@tanstack/react-query"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./course-content-page.module.css"
import ChatPage from '../components/chat.component'

const { Title, Text } = Typography;
const { Panel } = Collapse;

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 300000 } }
});


export const CourseContentPage = (props: any) => {
    const { id } = useResource();
    const [lessonIndex, setLessonIndex] = useState(0);
    const [open, setOpen] = useState(true);
    const [openChat, setOpenChat] = useState(false);
    const [isLandscape, setIsLandscape] = useState(window.screen.orientation.type.includes("landscape"));
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const courseQuery = useQuery<ICourse>({
        queryKey: ['courses'],
        queryFn: () => getCourse(id),
    })

    const { status, isLoading } = courseQuery;

    if (courseQuery.status === "loading") return <h1>Loading...</h1>;
    if (courseQuery.status === "error") return <h1>{JSON.stringify(courseQuery.error)}</h1>

    const course: ICourse = courseQuery.data;

    window.screen.orientation.addEventListener("change", function (e) {
        setIsLandscape(window.screen.orientation.type.includes("landscape"));
    });

    window.onresize = () => {
        setIsMobile(window.innerWidth <= 768);
    }

    function handlePlayVideo(lessonIndex: number) {
        setLessonIndex(lessonIndex);
    }

    function handleCheckBox() {
        console.log('Checked')
    }

    function handleDrawerToggle() {
        setOpen(!open)
    }

    function handleChatDrawerToggle() {
        setOpenChat(!open)
    }

    // const showDrawer = () => {
    //     setOpen(true);
    // };

    const onClose = () => {
        setOpen(false);
    };

    const onCloseChat = () => {
        setOpenChat(false);
    };

    const BUTTON_SIZE = 40;


    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Row style={{ padding: 8, minHeight: 48, width: "100%", display: "flex", justifyContent: "start", alignItems: "center" }}>
                    <Title style={{ margin: "auto 12px" }} level={5}>{`${course.title} > ${course.lessons_id[lessonIndex].title}`}</Title>
                </Row>
                <Row style={{ padding: 0 }}>
                    <Col sm={24} >
                        <ReactPlayer
                            url={course.lessons_id[lessonIndex].video}
                            controls={true}
                            style={(isLandscape && isMobile) ?
                                { zIndex: 50, display: "flex", width: `${window.screen.width}`, height: `${window.screen.height}`, position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }
                                : { width: "100%", minWidth: 375, maxHeight: 420 }}
                        />
                    </Col>
                    <Col sm={22} style={{ padding: 20 }}>
                        <Text>{course.lessons_id[lessonIndex].description}</Text>
                    </Col>
                </Row>
                <FloatButton.Group shape="square"
                    style={{ zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center",  top: 68, right: 0, height: BUTTON_SIZE*1.1, width: BUTTON_SIZE }}

                >
                    <FloatButton style={{height: "100%", width: "100%"}}
                        onClick={handleDrawerToggle}
                        icon={<ArrowLeftOutlined />}
                        description={<Text style={{fontSize: "0.50rem", padding: 0, margin: 0}}>Lesson</Text>}
                        tooltip="Lesson"

                    />
                </FloatButton.Group>
                <FloatButton.Group shape="square"
                    style={{ zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", bottom: 68, left: 0, height: BUTTON_SIZE*1.1, width: BUTTON_SIZE }}

                >
                    <FloatButton style={{height: "100%", width: "100%"}}
                        onClick={handleChatDrawerToggle}
                        icon={<ArrowRightOutlined />}
                        description={<Text style={{fontSize: "0.50rem", padding: 0, margin: 0}}>Chat</Text>}
                        tooltip="Chat"
                    />
                </FloatButton.Group>
                <Drawer
                    title={`Course Chat for ${course.title}`}
                    placement="left"
                    onClose={onCloseChat}
                    open={openChat}
                    mask={false}
                    width={"80%"}
                    height={"100%"}
                    maskClosable={false}
                    bodyStyle={{
                        padding: 24
                    }}
                >
                    {course?.discussions_id ? 
                    <Col sm={24}>
                        <ChatPage 
                            discussions_id={course.discussions_id} course_id={course._id} />
                    </Col> : <Title>Chat is empty</Title>}
                </Drawer>
                <Drawer
                    title="Course Content"
                    placement="right"
                    onClose={onClose}
                    open={open}
                    mask={false}
                    width={350}
                    maskClosable={false}
                    height="bottom"
                    bodyStyle={{
                        padding: 0
                    }}
                >
                    <List
                        style={{
                            overflowY: "scroll",
                            height: "calc(100vh - 64px)",
                            width: "100%",
                            padding: 0,
                        }}
                        itemLayout="vertical"
                        dataSource={course.lessons_id}
                        size="large"
                        bordered={true}
                        // header={(<span>This is the list header</span>)}
                        // footer={(<span>This is the list footer</span>)}
                        loading={isLoading}
                        split={true}
                        renderItem={(lesson: ILesson, index) => (
                            <List.Item
                                key={lesson._id}
                                extra={<></>}
                                style={{ padding: 0 }}

                            >
                                <Collapse style={{ padding: 0, width: "100%" }} expandIconPosition="end" bordered={true}>
                                    <Panel

                                        key={lesson.title}
                                        style={{ width: "100%" }}
                                        header={
                                            <div style={{ width: "100%", display: "flex", justifyContent: "start", alignItems: "start", padding: 0 }}>
                                                <Checkbox style={{ marginRight: 12 }} onChange={handleCheckBox} />
                                                <div onClick={() => handlePlayVideo(index)} style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "start" }}>
                                                    <div><Text style={{ width: 300, margin: "0" }}>{lesson.title}</Text></div>
                                                    <br />
                                                    <Text style={{ width: "100%" }}><PlaySquareOutlined /><strong style={{ margin: "0 12px" }}>{`${lesson.duration} mins`}</strong></Text>
                                                </div>
                                            </div>}
                                    >
                                        <Row align="middle" >
                                            <Col sm={10}>
                                                <img
                                                    width={130}
                                                    alt="lesson image"
                                                    src={lesson.image}
                                                    style={{ padding: 0 }}
                                                />

                                            </Col>
                                            <Col sm={14} style={{ padding: 8 }}>
                                                <Text >{lesson.description ? `${lesson.description.slice(0, 100)}...(more)` : ""}</Text>
                                            </Col>
                                        </Row>

                                    </Panel>
                                </Collapse>

                            </List.Item>
                        )}
                    />
                </Drawer>
            </QueryClientProvider >
        </>
    );
};

export default CourseContentPage;