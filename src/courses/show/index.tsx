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
import { LessonEdit } from "./lessonEdit";
// import Demo from "./demo"
import DraggableTable from "./draggableTable";

const { Title } = Typography;

export const CourseShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow();
    const { data, isLoading, isError } = queryResult;

    const course = data?.data;

    // <Title level={5}>Lessons</Title>
    // {record?.lessons_id?.map((item: any) => (
    //     <TagField value={item?.title} key={item?.title} />
    // ))}

    return (
        <>
            <Show isLoading={isLoading}>
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
                    <Col xs={18}>
                        <LessonEdit />
                    </Col>
                </Row>
                <Row>
                    <Col xs={24}>
                        <DraggableTable />
                    </Col>
                </Row>

            </Show>
        </>
    );
};


export default CourseShow;