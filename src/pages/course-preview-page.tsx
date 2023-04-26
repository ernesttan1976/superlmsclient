import React, { useState } from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import {
    Show,
    TagField,
    TextField,
    DateField,
} from "@refinedev/antd";
import { Typography, Image, Row, Col } from "antd";
import { useQuery } from "@tanstack/react-query"
import { getCourse } from "../api/courses"
import { useResource } from "@refinedev/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import ReactPlayer from "react-player";

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 300000 } }
});
const { Title, Text } = Typography;

export const CoursePreviewPage: React.FC<IResourceComponentsProps> = () => {

    const { id } = useResource();

    const courseQuery = useQuery({
        queryKey: ['courses'],
        queryFn: () => getCourse(id),
    })
    const [isLandscape, setIsLandscape] = useState(window.screen.orientation.type.includes("landscape"));
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


    if (courseQuery.status === "loading") return <h1>Loading...</h1>;
    if (courseQuery.status === "error") return <h1>{JSON.stringify(courseQuery.error)}</h1>

    const course = courseQuery.data;

    return (
        <QueryClientProvider client={queryClient}>
            <Row style={{ padding: 0 }}>
                <Col sm={24} >
                    <ReactPlayer
                        url={course.lessons_id[0].video}
                        controls={true}
                        style={(isLandscape && isMobile) ?
                            { zIndex: 50, display: "flex", width: `${window.screen.width}`, height: `${window.screen.height}`, position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }
                            : { width: "100%", minWidth: 375, maxHeight: 420 }}
                    />
                </Col>
                <Col sm={22} style={{ padding: 20 }}>
                    <Text>{course.lessons_id[0].description}</Text>
                </Col>
            </Row>
            <Row style={{ padding: 24 }}>
                <Col sm={12}>
                    <Title level={5}>Course Title</Title>
                    <TextField value={course?.title} />
                    <Title level={5}>Description</Title>
                    <TextField value={course?.description} />
                    <Title level={5}>Start Date</Title>
                    <DateField value={course?.startDate} />
                    <Title level={5}>End Date</Title>
                    <DateField value={course?.endDate} />
                </Col>
                <Col sm={12}>
                    <Title level={5}>Lessons</Title>
                    {course?.lessons_id?.map((lesson: any) => (
                        <TagField value={lesson?.title} key={lesson?.title} />
                    ))}
                </Col>
            </Row>

        </QueryClientProvider>
    );
};


export default CoursePreviewPage;