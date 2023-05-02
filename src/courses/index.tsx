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
    DeleteButton,
    CloneButton
} from "@refinedev/antd";
import { Table, Space, Avatar, Tooltip, Typography, Button } from "antd";
import { Link } from "react-router-dom";
import { EditButton2 } from "components/buttons/edit";
const { Title } = Typography;

export const CourseList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });


    return (
        <List>
            <Table {...tableProps} rowKey='_id'>
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_: any, record: BaseRecord) => (
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "center", flexWrap: "wrap", alignItems: "center"}}>
                        <Space size="small" wrap>
                            {/* <Link to={`/courses/edit/${record._id}/lessons`}><Button>Edit Lessons</Button></Link> */}
                            <EditButton
                                size="small"
                                recordItemId={record._id}
                            >Course Edit</EditButton>

                            <ShowButton
                                size="small"
                                recordItemId={record._id}>
                                    Show
                                </ShowButton>
                            <CloneButton
                                size="small"
                                recordItemId={record._id}
                            >Clone</CloneButton>
                            <DeleteButton
                                size="small"
                                recordItemId={record._id}
                            >Delete</DeleteButton>
                        </Space>
                        </div>
                    )}
                />
                <Table.Column dataIndex="title" title="Title" />
                <Table.Column dataIndex="description" title="Description" />
                <Table.Column
                    dataIndex={["image"]}
                    title="Image"
                    render={(value: any[]) => (
                        <div style={{ width: "200px" }}>
                            {value?.map((item) => (
                                // <TagField value={item?.name} key={item?.name} />
                                <ImageField
                            style={{ width: "200px" }}
                            value={item.url}/>
                            ))}
                        </div>
                        
                    )}
                />
                <Table.Column
                    dataIndex={["instructor_id"]}
                    title="Instructor"
                    render={(value: any) => (
                        <div style={{ width: "80" }}>
                            <Tooltip title={value.name}>
                                <Avatar size={80} src={value.avatar} />
                                <Title style={{ display: "flex", textAlign: "center", wordBreak: "keep-all" }} level={5}>{value.name}</Title>
                            </Tooltip>
                        </div>
                    )}
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
                        <div style={{ width: "200px" }}>
                            {value?.map((item) => (
                                // <TagField value={item?.name} key={item?.name} />
                                <Tooltip title={item.name}>
                                    <Avatar src={item.avatar} />
                                </Tooltip>
                            ))}
                        </div>
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

            </Table>
        </List>
    );
};

export default CourseList;