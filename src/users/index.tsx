import React from "react";
import { IResourceComponentsProps, BaseRecord, useMany } from "@refinedev/core";
import {
    useTable,
    List,
    EditButton,
    ShowButton,
    TagField,
    EmailField,
    ImageField,
    DateField,
} from "@refinedev/antd";
import { Table, Space } from "antd";


export const UserList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    const { data: courseData, isLoading: courseIsLoading } = useMany({
        resource: "courses",
        ids: [].concat(
            ...(tableProps?.dataSource?.map((item) => item?._id) ?? []),
        ),
        queryOptions: {
            enabled: !!tableProps?.dataSource,
        },
    });
    console.dir(courseData)

    return (
        <List>
            <Table {...tableProps} rowKey="_id">
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <ShowButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                        </Space>
                    )}
                />
                <Table.Column dataIndex="name" title="Name" />
                <Table.Column
                    dataIndex={["email"]}
                    title="Email"
                    render={(value: any) => <EmailField value={value} />}
                />
                <Table.Column dataIndex="userRole" title="User Role" />
                <Table.Column
                    dataIndex={["avatar"]}
                    title="Avatar"
                    render={(value: any) => (
                        <ImageField
                            style={{ maxWidth: "100px" }}
                            value={value}
                        />
                    )}
                />
                <Table.Column
                    dataIndex="courses_id"
                    title="Courses"
                    render={(value: any[]) =>
                        courseIsLoading ? (
                            <>Loading...</>
                        ) : (
                            <>
                                {value?.map((item, index) => (
                                    <TagField
                                        key={index}
                                        value={
                                            courseData?.data?.find(
                                                (resourceItems) =>
                                                    resourceItems._id ===
                                                    item,
                                            )?.title
                                        }
                                    />
                                ))}
                            </>
                        )
                    }
                />
                <Table.Column
                    dataIndex={["created_at"]}
                    title="Created At"
                    render={(value: any) => <DateField value={value} />}
                />
                <Table.Column
                    dataIndex={["updated_at"]}
                    title="Updated At"
                    render={(value: any) => <DateField value={value} />}
                />
            </Table>
        </List>
    );
};

export default UserList