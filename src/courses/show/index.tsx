import React from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import {
    Show,
    TagField,
    TextField,
    ImageField,
    DateField,
} from "@refinedev/antd";
import { Typography, Row, Col } from "antd";
import { LessonEdit } from "./lessonEdit";
import Demo from "./demo"

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
                    <Col xs={6}>
                        <Title level={5}>Title</Title>
                        <TextField value={course?.title} />
                        <Title level={5}>Description</Title>
                        <TextField value={course?.description} />
                        <Title level={5}>Image</Title>
                        <ImageField style={{ maxWidth: "400px" }} value={course?.image} />
                        <Title level={5}>Start Date</Title>
                        <DateField value={course?.startDate} />
                        <Title level={5}>End Date</Title>
                        <DateField value={course?.endDate} />
                    </Col>
                    <Col xs={6}>
                        <Demo />
                    </Col>
                    <Col xs={12}>
                        <LessonEdit />
                    </Col>
                </Row>

            </Show>
        </>
    );
};


export default CourseShow;