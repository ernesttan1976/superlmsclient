import React from "react";
import { IResourceComponentsProps, useShow, useMany } from "@refinedev/core";
import {
    Show,
    TagField,
    TextField,
    EmailField,
    ImageField,
    DateField,
    NumberField,
} from "@refinedev/antd";
import { Typography } from "antd";

const { Title } = Typography;

export const UserShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    const { data: coursesData, isLoading: coursesIsLoading } = useMany({
        resource: "courses",
        ids: record?.courses_id || [],
        queryOptions: {
            enabled: !!record,
        },
    });

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>Courses</Title>
            {coursesIsLoading ? <>Loading...</> : <></>}
            <Title level={5}>Name</Title>
            <TextField value={record?.name} />
            <Title level={5}>Email</Title>
            <EmailField value={record?.email} />
            <Title level={5}>User Role</Title>
            <TextField value={record?.userRole} />
            <Title level={5}>Avatar</Title>
            <ImageField style={{ maxWidth: 200 }} value={record?.avatar} />
            <Title level={5}>Courses</Title>
            {coursesIsLoading ? (
                <>Loading...</>
            ) : (
                <>
                    {coursesData?.data?.map((course: any) => (
                        <TagField key={course?.title} value={course?.title} />
                    ))}
                </>
            )}
            <Title level={5}>Created At</Title>
            <DateField value={record?.created_at} />
            <Title level={5}>Updated At</Title>
            <DateField value={record?.updated_at} />
        </Show>
    );
};

export default UserShow