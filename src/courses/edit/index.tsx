import React from "react";
import { useState, useEffect, useRef, RefObject } from 'react';
import { IResourceComponentsProps, useApiUrl, useList, useSelect, useUpdate } from "@refinedev/core";
import { TextField, ImageField, DateField, Edit, useForm } from "@refinedev/antd";
import { Typography, Row, Col, Space, Card, Form, Input, Select, InputRef, RefSelectProps, DatePicker, Avatar, Upload, Badge, Image, Button, Breadcrumb } from "antd";
import DraggableTable from "./draggableTable";
import { ICourse, IUser, ILesson, IDiscussion } from "../../models"
import Meta from "antd/es/card/Meta";
import ReactPlayer from "react-player";
import "./edit.module.css"

const { Title } = Typography;

type SelectRef = {
    focus: () => void;
    blur: () => void;
    scrollTo: (scrollTop: number) => void;
};

export const CourseEdit: React.FC<IResourceComponentsProps> = () => {
    let titleRef = useRef<InputRef | null>(null)
    let descriptionRef = useRef<InputRef | null>(null)
    let imageRef = useRef<InputRef | null>(null)
    let videoRef = useRef<InputRef | null>(null)
    let durationRef = useRef<InputRef | null>(null)
    let selectRef = useRef<RefSelectProps>(null)

    const formObject = useForm<ICourse>();
    const { formProps, saveButtonProps, queryResult } = formObject
    const apiUrl = useApiUrl();
    const [imageUrl, setImageUrl] = useState<string>("");

    const [lessons, setLessons] = useState<ILesson[]>([]);
    const [lessonIndex, setLessonIndex] = useState<number>(0);

    useEffect(() => {
        setLessons(queryResult?.data?.data.lessons_id ?? []);
    }, [queryResult])


    if (!queryResult) return <Title level={2}>Loading...</Title>
    const course = queryResult?.data?.data;

    // const { mutate } = useUpdate();
    // mutate({
    //     resource: "products",
    //     values: {
    //         name: "New Product",
    //         material: "Wood",
    //     },
    //     id: 1,
    // });

    function handleSelectChange(value: number) {
        setLessonIndex(value)
    }

    return (
        <>
            <Edit saveButtonProps={saveButtonProps}>
                <Form {...formProps} layout="vertical">
                    <Title level={2}>Course Details: {course?.title}</Title>
                    <Title level={4}>Instructor: {course?.instructor_id.name}</Title>
                    <Row>
                        <Col xs={24} style={{ margin: 48 }}>
                            <Space size="large" direction="horizontal" align="start">
                                <Space>
                                    <ImageField style={{ maxWidth: "400px" }} value={course?.image} />
                                </Space>
                                <Space direction="vertical">
                                    <Space align="baseline">
                                        <Title level={5}>Title</Title>
                                        <TextField value={course?.title} />
                                    </Space>
                                    <Space align="baseline">
                                        <Title level={5}>Description</Title>
                                        <TextField value={course?.description} />
                                    </Space>
                                </Space>
                                <Space direction="vertical">
                                    <Space align="baseline">
                                        <Title level={5}>Start Date</Title>
                                        <DateField value={course?.startDate} />
                                    </Space>
                                    <Space align="baseline">
                                        <Title level={5}>End Date</Title>
                                        <DateField value={course?.endDate} />
                                    </Space>
                                </Space>
                            </Space>
                        </Col>
                    </Row>

                    <Title level={2}>Select Lesson To Edit</Title>
                    <Row>
                        <Col xs={24}>
                            <Select
                                placeholder="Select Lesson to Edit"
                                style={{ minWidth: 350, maxWidth: "60vw" }}
                                onChange={handleSelectChange}
                                ref={selectRef}
                            >
                                {lessons?.map((lesson: ILesson, index: number) => (
                                    <Select.Option key={index} value={index}>
                                        {lesson.title}
                                    </Select.Option>))}
                            </Select>


                            <Form.Item
                                label={`Lesson ${lessonIndex + 1}`}
                            >
                                <Row gutter={8}>
                                    <Col sm={12}>
                                        <Form.Item
                                            label="Title"
                                            name={["lessons_id", lessonIndex, "title"]}
                                        >
                                            <Input type="text" ref={titleRef} />
                                        </Form.Item>
                                        <Form.Item
                                            label="Description"
                                            name={["lessons_id", lessonIndex, "description"]}
                                        >
                                            <Input type="text" ref={descriptionRef} />
                                        </Form.Item>
                                        <Form.Item
                                            label="Duration (min)"
                                            name={["lessons_id", lessonIndex, "duration"]}
                                        >
                                            <Input type="text" ref={durationRef} />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={12}>
                                        <Card
                                            hoverable
                                            style={{ width: 320, minHeight: 320, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}
                                            cover={<img src={lessons[lessonIndex]?.image} />}
                                        >
                                            <Meta title={lessons[lessonIndex]?.title} description={lessons[lessonIndex]?.description} />
                                        </Card>
                                    </Col>
                                </Row>
                                <Row justify="center" align="top">
                                    <Col sm={24}>
                                        <Form.Item
                                            label="Image Url"
                                            name={["lessons_id", lessonIndex, "image"]}
                                        >
                                            <Input type="text" ref={imageRef} />
                                        </Form.Item>
                                        <Image src={lessons[lessonIndex]?.image} />
                                    </Col>
                                </Row>
                                <Row justify="center" align="top" className='player-wrapper'>
                                    <Form.Item
                                        label="Video Url"
                                        name={["lessons_id", lessonIndex, "video"]}
                                    >
                                        <Input type="text" ref={videoRef} />
                                    </Form.Item>
                                    <ReactPlayer 
                                    url={lessons[lessonIndex]?.video} 
                                    playing={false} 
                                    controls={true}
                                    width='100%'
                                    className='react-player'
                                    pip={true}/>
                                </Row>
                            </Form.Item>

                        </Col>
                    </Row>

                    <Title level={2}>Lessons</Title>
                    <Title level={4}>Drag and drop to change the order</Title>
                    <Row>
                        <Col xs={24}>
                            <DraggableTable />
                        </Col>
                    </Row>
                </Form>
            </Edit >
        </>
)}
export default CourseEdit;
