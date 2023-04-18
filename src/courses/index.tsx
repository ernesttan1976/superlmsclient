import React from "react";
import { IResourceComponentsProps, BaseRecord } from "@refinedev/core";
import {
    useTable,
    List,
    EditButton,
    ShowButton,
    ImageField,
    DateField,
    TagField,
} from "@refinedev/antd";
import { Table, Space } from "antd";

export const CourseList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });
    
    return (
        <List>
            <Table {...tableProps} rowKey="_id">
                <Table.Column dataIndex="title" title="Title" />
                <Table.Column dataIndex="description" title="Description" />
                <Table.Column
                    dataIndex="image"
                    title="Image"
                    render={(value: any) => (
                        <ImageField
                            style={{ width: "200px" }}
                            value={value}
                        />
                    )}
                />
                <Table.Column
                    dataIndex={["instructor_id", "name"]}
                    title="Instructor"
                />
                <Table.Column
                    dataIndex={["startDate"]}
                    title="Start Date"
                    render={(value: any) => <DateField value={value} />}
                />
                <Table.Column
                    dataIndex={["endDate"]}
                    title="End Date"
                    render={(value: any) => <DateField value={value} />}
                />
                <Table.Column
                    dataIndex="students_id"
                    title="Students"
                    render={(value: any[]) => (
                        <>
                            {value?.map((item) => (
                                <TagField value={item?.name} key={item?.name} />
                            ))}
                        </>
                    )}
                />
                <Table.Column
                    dataIndex="lessons_id"
                    title="Lessons"
                    render={(value: any[]) => (
                        <>
                            {value?.map((item) => (
                                <TagField
                                    value={item?.title}
                                    key={item?.title}
                                />
                            ))}
                        </>
                    )}
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
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record._id}
                            />
                            <ShowButton
                                hideText
                                size="small"
                                recordItemId={record._id}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};

export default CourseList;