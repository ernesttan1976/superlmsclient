import React from "react";
import { IResourceComponentsProps, useApiUrl } from "@refinedev/core";
import { Edit, useForm, getValueFromEvent } from "@refinedev/antd";
import { Form, Input, DatePicker, Upload } from "antd";
import dayjs from "dayjs";

export const CourseEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();

    const coursesData = queryResult?.data?.data;
    const apiUrl = useApiUrl();
    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Title"
                    name={["title"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name={["description"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Image"
                    name="image"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input.TextArea rows={5} />
                </Form.Item>

                <Form.Item label="Image">
                    <Form.Item
                        name="image"
                        valuePropName="image"
                        getValueFromEvent={getValueFromEvent}
                        noStyle
                    >
                        <Upload.Dragger
                            name="file"
                            action={`${apiUrl}/media/upload`}
                            listType="picture"
                            maxCount={1}
                            multiple
                        >
                            <p className="ant-upload-text">
                                Drag & drop a file in this area
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>

                <Form.Item
                    label="Start Date"
                    name={["startDate"]}
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
                    label="End Date"
                    name={["endDate"]}
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
                <>
                    {(coursesData?.lessons_id as any[])?.map((item, index) => (
                        <Form.Item
                            key={index}
                            label={`Lessons ${index + 1}`}
                            name={["lessons_id", index, "title"]}
                        >
                            <Input type="text" />
                        </Form.Item>
                    ))}
                </>
            </Form>
        </Edit>
    );
};


export default CourseEdit