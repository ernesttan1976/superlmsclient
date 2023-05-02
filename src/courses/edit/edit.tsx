import React, { useEffect } from "react";
import { useState } from 'react';
import { IResourceComponentsProps, useList } from "@refinedev/core";
import { Create, useForm, getValueFromEvent, Edit } from "@refinedev/antd";
import { Form, Input, DatePicker, Avatar, Upload, Select, Tabs, message } from "antd";
import dayjs from "dayjs";
import axios from 'axios';
import { ICourse, IInstructors, IUploadFile } from "models";
import LessonEdit from "./lessonEdit";
import type { UploadProps } from 'antd';

const DATA_URI = (process.env.NODE_ENV === 'production') ? process.env.REACT_APP_PRODUCTION_URI : process.env.REACT_APP_DEV_URI;

export const CourseEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult, onFinish } = useForm<ICourse>({
        action: "edit",
        resource: "courses",
        redirect: false,
        // onMutationError: (data, variables, context) => {
        //     console.log({ data, variables, context });
        // },
        // onMutationSuccess: (data, variables, context) => {
        //     //console.log({ data, variables, context });
        //     console.log("data=>", data.data)
        //     console.log("variables=>", variables)
        // },
        invalidates: ["detail"],
        successNotification: (data, values, resource) => {
            return {
                message: `Edit successful: ${JSON.stringify({ ...values })}`,
                description: "Success with no errors",
                type: "success",
            };
        },
    });

    const handleOnFinish = (values: ICourse | any) => {
      
        // Modify the image object to match the desired structure
        const newImage: IUploadFile[] = [];
        values?.image.forEach((x: any) => {
          if (x.response) {
            newImage.push({
              name: x.response.name,
              url: x.response.url,
              size: x.response.size,
              key: x.response.key,
              uid: x.originFileObj.uid,
            });
          } else {
            newImage.push({
              name: x.name,
              url: x.url,
              size: x.size,
              key: x.key,
              uid: x.uid,
            });
          }
        });
      
        onFinish({
          ...values,
          image: newImage,
        });
      };

    // useEffect(() => {
    //     // console.log("formProps=>",formProps);
    //     // console.log("saveButtonProps=>", saveButtonProps);
    //     // console.log("queryResult=>",queryResult)
    //     // console.log(formProps.onValuesChange)

    // }, [])
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

    const options = data?.data.map((item: IInstructors) => ({
        label: item.name,
        value: item._id,
    }))

    const props: UploadProps = {

        name: "file",
        action: `${DATA_URI}/media/upload-image`,
        listType: "picture",
        maxCount: 5,
        multiple: true,
        onChange(info: any) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
                message.loading(`Uploading ${info.file} ${info.fileList}`);
            }
            if (status === 'done') {
                console.log("S3 File Info?", info)
                // info.fileList.map((x: any) => {
                //     console.log(x.response);
                // })
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e: { dataTransfer: { files: any; }; }) {
            message.success('Dropped files', e.dataTransfer.files);
        },
        async onRemove(file: any) {
            // Make a DELETE request to remove the file from the server
            // console.log("Removing from S3",file.key)
            const response = await axios.post(`${DATA_URI}/media/remove-image/${file.key}`);
            // console.log(response);
          }
    }


    const courseEditElements = () => {
        return (
            <>
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
                        valuePropName="fileList"
                        getValueFromEvent={getValueFromEvent}
                        noStyle
                    >
                        <Upload.Dragger {...props}
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
                        <Form.Item
                            label="Instructor"
                            name={["instructor_id", "_id"]}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
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
            </>
        )
    }

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} onValuesChange={handleOnFinish} layout="vertical">
                <Tabs defaultActiveKey="1" items={[
                    {
                        label: 'Course Details Edit',
                        key: '1',
                        children: courseEditElements(),
                    },
                    {
                        label: 'Lessons Edit',
                        key: '2',
                        children: <LessonEdit />,
                    },
                ]}
                />
            </Form>
        </Edit>
    );
};


export default CourseEdit
