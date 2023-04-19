import React from "react";
import { IResourceComponentsProps, useApiUrl, useList } from "@refinedev/core";
import { Edit, useForm, getValueFromEvent, useSelect } from "@refinedev/antd";
import { Form, Input, DatePicker, Avatar, Upload, Select, Badge} from "antd";
import dayjs from "dayjs";

interface IInstructors {
    _id: string;
    name: string;
}

export const CourseEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm();

    const { data, isLoading, isError } = useList<IInstructors>({
        resource: "users",
        filters: [
            {
                field: "role",
                operator: "eq",
                value: "Instructor",
            },
        ],
    });

    const options = data?.data.map((item) => ({
        label: item.name,
        value: item._id,
    }));

    const { selectProps } = useSelect({
        name: ["instructor_id"],
        rules: [{ required: true }],
        options,
    });


    const apiUrl = useApiUrl();
    const coursesData = queryResult?.data?.data;
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

                <Form.Item label="Image">
                    <Form.Item
                        name={['image']}
                        valuePropName="value"
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
                <Badge text="X">
                    <Avatar size={64} src={['image']} />
                </Badge>
                

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
                <Form.Item label="Instructor" {...selectProps}>
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