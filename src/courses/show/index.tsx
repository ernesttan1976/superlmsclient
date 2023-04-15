import React from "react";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import {
    Show,
    TagField,
    TextField,
    MarkdownField,
    DateField,
    NumberField,
} from "@refinedev/antd";
import { Typography } from "antd";

const { Title } = Typography;

export const CourseShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>Title</Title>
            <TextField value={record?.title} />
            <Title level={5}>Description</Title>
            <TextField value={record?.description} />
            <Title level={5}>Image</Title>
            <MarkdownField value={record?.image} />
            <Title level={5}>Start Date</Title>
            <DateField value={record?.startDate} />
            <Title level={5}>End Date</Title>
            <DateField value={record?.endDate} />
            <Title level={5}>Lessons</Title>
            {record?.lessons_id?.map((item: any) => (
                <TagField value={item?.title} key={item?.title} />
            ))}
            <Title level={5}>Created At</Title>
            <DateField value={record?.created_at} />
            <Title level={5}>Updated At</Title>
            <DateField value={record?.updated_at} />
        </Show>
    );
};

export default CourseShow;