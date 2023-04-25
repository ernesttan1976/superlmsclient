import React from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import {
    Show,
    TagField,
    TextField,
    ImageField,
    DateField,
} from "@refinedev/antd";
import { Typography, Row, Col, Space } from "antd";
// import {ICourse, IUser, ILesson, IDiscussion} from "../../models"

const { Title } = Typography;

export const CourseShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow();
    const { data, isLoading, isError } = queryResult;

    const course = data?.data;

    return (
        <>
            <Show isLoading={isLoading}>
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
                                <Space align="baseline">
                                    <Title level={5}>Price</Title>
                                    <TextField value={`$${course?.price}`} />
                                </Space>
                            </Space>
                        </Space>
                    </Col>
                </Row>

            </Show>
        </>
    );
};


export default CourseShow;