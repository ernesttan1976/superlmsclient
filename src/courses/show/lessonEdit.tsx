import React from "react";
import { useState } from 'react';
import { IResourceComponentsProps, useApiUrl, useList, useSelect } from "@refinedev/core";
import { Edit, useForm, getValueFromEvent } from "@refinedev/antd";
import { Form, Input, DatePicker, Avatar, Upload, Select, Badge, Row, Col } from "antd";
import dayjs from "dayjs";

interface ILesson {
    title: string;
    description: string;
    image: string;
    video: string;
    duration: number;
}


export const LessonEdit: React.FC<IResourceComponentsProps> = () => {
    const formObject = useForm();
    const { formProps, saveButtonProps, queryResult } = formObject
    const apiUrl = useApiUrl();
    const [imageUrl, setImageUrl] = useState<string>("");

    const lessons: ILesson[] = queryResult?.data?.data.lessons_id;

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                {lessons?.map((item, index) => (
                    <Form.Item
                        key={index}
                        label={`Lessons ${index + 1}`}
                        name={["lessons_id", index, "title"]}
                    >
                        <Input type="text" />
                    </Form.Item>
                ))}
            </Form>
        </Edit>
    );
};


export default LessonEdit