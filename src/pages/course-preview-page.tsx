import React from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import {
    Show,
    TagField,
    TextField,
    DateField,
} from "@refinedev/antd";
import { Typography, Image, Row, Col} from "antd";
import { useQuery } from "@tanstack/react-query"
import { getCourse } from "../api/courses"
import { useResource } from "@refinedev/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 300000 } }
});
const { Title } = Typography;

export const CoursePreviewPage: React.FC<IResourceComponentsProps> = () => {

    const { id } = useResource();

    const courseQuery = useQuery({
        queryKey: ['courses'],
        queryFn: () => getCourse(id),
    })

    if (courseQuery.status === "loading") return <h1>Loading...</h1>;
    if (courseQuery.status === "error") return <h1>{JSON.stringify(courseQuery.error)}</h1>

    const course = courseQuery.data;

    return (
        <QueryClientProvider client={queryClient}>
            <Row style={{ padding: 24, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{ maxWidth: "350px" }} src={course?.image} />
            </Row>
            <Row style={{ padding: 24}}>
                <Col sm={12}>
                    <Title level={5}>Title</Title>
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