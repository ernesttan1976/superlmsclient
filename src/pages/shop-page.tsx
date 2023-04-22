import React from "react";
import { useList, HttpError, useLink } from "@refinedev/core";
import { useState } from "react";
import dayjs from "dayjs";
import { Typography, Image, Card, Row, Col, TreeSelect, Button, Space } from "antd";
import { EyeOutlined, DollarCircleOutlined, PlaySquareOutlined } from '@ant-design/icons'


const { Title, Text } = Typography;
const { Meta } = Card;


interface ICourse {
    _id: number;
    title: string;
    description: string;
    image: string;
    startDate: Date;
    endDate: Date;
    price: number;
    instructor_id: IUser;
    students_id: [IUser];
    lessons_id: [ILesson];
    discussions_id: [object];
}

interface IUser {
    _id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    avatar: string;
    courses_id: [number];
}

interface ILesson {
    _id: number;
    title: string;
    description: string;
    image: string;
    video: string;
    duration: number;
}

export const ShopPage = () => {
    const Link = useLink();
    const [value, setValue] = useState<string>();
    //this is similar to useQuery from Tanstack Query
    const courseList = useList<ICourse, HttpError>({
        resource: "courses",
        queryOptions: {
            onSuccess: ()=>{
                console.log('success');
            },
        }
    });
    const { data, isLoading, isError, error } = courseList;
  
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Something went wrong! {error.message} </div>;
    }


    //5d93ad92609d4c77cce4224f6119cb7a
    //https://ernest-ga-bucket1.s3.ap-southeast-1.amazonaws.com/tourism01.jpg
    // <img src="https://ernest-ga-bucket1.s3.ap-southeast-1.amazonaws.com/tourism01.jpg" alt="" />



    const onChange = (newValue: string) => {
        console.log(newValue);
        setValue(newValue);
    };

    const courses = data?.data ?? [];

    return (
        <Col style={{ padding: 24 }}>
            <Title level={2}>Course Catalog</Title>

            <Space size="large" wrap={true} style={{ justifyContent: "space-around" }}>
                {courses?.map((course) => (
                    <Col xs={24} sm={12} md={6} lg={6} xl={6} >
                        <Space size="large" >
                            <Card
                                key={course._id}
                                hoverable
                                style={{ width: 320, minHeight: 320, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}
                                cover={<img alt={course.title} src={course.image} />}
                            >
                                <Meta title={course.title} description={course.description} />
                                <ul>
                                    <li><Text>{`Start of Course: ${dayjs(course.startDate,).format('DD/MM/YYYY')}`}</Text></li>
                                    <li><Text>{`End of Course: ${dayjs(course.endDate).format('DD/MM/YYYY')}`}</Text></li>
                                </ul>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Row>
                                        <Space>
                                            <Link to={`/courses/preview/${course._id}`}><Button style={{ width: 100 }} type="primary" icon=<EyeOutlined /> >Preview</Button></Link>
                                            <Button style={{ width: 165 }} type="primary" icon=<DollarCircleOutlined /> >Add to Cart ${course.price}</Button>
                                        </Space>
                                    </Row>
                                    <Link to='/cart'>
                                        <Link to={`/courses/content/${course._id}`}>
                                            <Button style={{ width: 273 }} type="primary" icon=<PlaySquareOutlined /> >Learn</Button>
                                        </Link>

                                    </Link>
                                </Space>
                            </Card>
                        </Space>
                    </Col>
                ))}
                {courses?.map((course) => (
                    <Col xs={24} sm={12} md={6} lg={6} xl={6} >
                        <Space size="large" >
                            <Card
                                key={course._id}
                                hoverable
                                style={{ width: 320, minHeight: 320, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}
                                cover={<img alt={course.title} src={course.image} />}
                            >
                                <Meta title={course.title} description={course.description} />
                                <ul>
                                    <li><Text>{`Start of Course: ${dayjs(course.startDate,).format('DD/MM/YYYY')}`}</Text></li>
                                    <li><Text>{`End of Course: ${dayjs(course.endDate).format('DD/MM/YYYY')}`}</Text></li>
                                </ul>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Row>
                                        <Space>
                                            <Link to={`/courses/preview/${course._id}`}><Button style={{ width: 100 }} type="primary" icon=<EyeOutlined /> >Preview</Button></Link>
                                            <Button style={{ width: 165 }} type="primary" icon=<DollarCircleOutlined /> >Add to Cart ${course.price}</Button>
                                        </Space>
                                    </Row>
                                    <Link to='/cart'>
                                        <Link to={`/courses/content/${course._id}`}>
                                            <Button style={{ width: 273 }} type="primary" icon=<PlaySquareOutlined /> >Learn</Button>
                                        </Link>

                                    </Link>
                                </Space>
                            </Card>
                        </Space>
                    </Col>
                ))}

            </Space>
        </Col>
    );
};

export default ShopPage;