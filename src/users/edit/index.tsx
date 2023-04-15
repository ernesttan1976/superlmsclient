import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Edit, useForm, useSelect, getValueFromEvent } from "@refinedev/antd";
import { Form, Input, Select, Upload, DatePicker } from "antd";
import dayjs from "dayjs";

export const UserEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();

    const usersData = queryResult?.data?.data;

    const { selectProps: coursesSelectProps } = useSelect({
        resource: "courses",
        defaultValue: usersData?.courses_id,
    });

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Courses"
                    name={"courses_id"}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select mode="multiple" {...coursesSelectProps} />
                </Form.Item>
                <Form.Item
                    label="Name"
                    name={["name"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name={["email"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="User Role"
                    name={["userRole"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Avatar">
                    <Form.Item
                        name="avatar"
                        getValueProps={(value) => ({
                            fileList: [{ url: value, name: value, uid: value }],
                        })}
                        getValueFromEvent={getValueFromEvent}
                        noStyle
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Upload.Dragger
                            listType="picture"
                            beforeUpload={() => false}
                        >
                            <p className="ant-upload-text">
                                Drag & drop a file in this area
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>
                <Form.Item
                    label="Created At"
                    name={["created_at"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : undefined,
                    })}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label="Updated At"
                    name={["updated_at"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : undefined,
                    })}
                >
                    <DatePicker />
                </Form.Item>
            </Form>
        </Edit>
    );
};

export default UserEdit;