import React from "react";
import {useState} from 'react';
import { IResourceComponentsProps, useApiUrl, useList } from "@refinedev/core";
import { Create, useForm, getValueFromEvent} from "@refinedev/antd";
import { Form, Input, DatePicker, Avatar, Upload, Select } from "antd";
import dayjs from "dayjs";
import axios from 'axios';
import { RcFile } from 'rc-upload/lib/interface';
import { UploadRequestOption } from 'rc-upload/lib/interface';

interface IInstructors {
    _id: string;
    name: string;
}

interface IOptions {
    label: string;
    value: number;
}

export const CourseCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();
    const apiUrl = useApiUrl();
    const [imageUrl, setImageUrl] = useState<string>("");
    const instructorsList = useList<IInstructors>({
        resource: "users",
        filters: [
            {
                field: "role",
                operator: "eq",
                value: "Instructor",
            },
        ],
    });
    const { data, isLoading, isError, error } = instructorsList;

    const  options = data?.data.map((item: IInstructors) => ({
        label: item.name,
        value: item._id,
    }))

    return (
        <Create saveButtonProps={saveButtonProps}>
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
                {instructorsList.isLoading ? <div>Loading...</div> :
                instructorsList.isError ? <div>Something went wrong! {instructorsList.error.message} </div> :
                <Form.Item label="Instructor" >
                    <Select
                        placeholder="Select Instructor"
                        style={{ width: 200 }}
                    >
                        {options?.map((option) => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>}
            </Form>
        </Create>
    );
};


export default CourseCreate