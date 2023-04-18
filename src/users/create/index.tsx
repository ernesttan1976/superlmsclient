import React from "react";
import { IResourceComponentsProps, HttpError } from "@refinedev/core";
import { Create, useForm, useSelect, getValueFromEvent } from "@refinedev/antd";
import { Form, Input, Upload, Select, DatePicker } from "antd";
import dayjs from "dayjs";

interface ICourse {
    _id: number;
    title: string;
    description: string;
    image: string;
    instructor_id: string;
    startDate: Date;
    endDate: Date;
    students_id: [string];
    lessons_id: [string];
    created_at: Date;
    updated_at: Date;
}

interface IUser{
    _id: string;
    name: string;
    email: string;
    password: string;
    role: ["Student"|"Instructor"|"Admin"];
    avatar: string;
    courses_id: [string]
 }

export const UserCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();

    const { selectProps: courseSelectProps } = useSelect<ICourse, HttpError>
    ({
        resource: "courses",
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
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
                    label="Password"
                    name={["password"]}
                    rules={[
                        {
                            required: true,
                            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password (confirm)"
                    name={["password2"]}
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
                    initialValue="Student"
                    rules={[
                        {
                            required: true,
                        },
                        {
                            enum: ["Student","Instructor","Admin"]
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
                                required: false,
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
                    label="Courses"
                    name={"courses_id"}
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                    getValueProps={(value: any[]) => {
                        return {
                            value: value?.map((item) => item?.title),
                        };
                    }}
                    getValueFromEvent={(selected: string[]) => {
                        return selected?.map((item) => ({ title: item }));
                    }}
                >
                    <Select mode="multiple" {...courseSelectProps} />
                </Form.Item>
            </Form>
        </Create>
    );
};

export default UserCreate;