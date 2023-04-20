import React from "react";
import { useList, HttpError, useLink } from "@refinedev/core";
import { useState } from "react";
import dayjs from "dayjs";
import { Typography, Image, Card, Row, Col, TreeSelect, Button } from "antd";
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

    const { data, isLoading, isError } = useList<ICourse, HttpError>({
        resource: "courses",
    });

    const [value, setValue] = useState<string>();

    const courses = data?.data ?? [];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Something went wrong!</div>;
    }


    //5d93ad92609d4c77cce4224f6119cb7a
    //https://ernest-ga-bucket1.s3.ap-southeast-1.amazonaws.com/tourism01.jpg
    // <img src="https://ernest-ga-bucket1.s3.ap-southeast-1.amazonaws.com/tourism01.jpg" alt="" />



    const onChange = (newValue: string) => {
        console.log(newValue);
        setValue(newValue);
    };

    // const handleCardClick=(event: React.SyntheticEvent, course_id: Number)=>{
    //     //show/:id
    //     const key: BaseKey = course_id.toString()
    //     show("courses", key);
    // }

    return (
        <Col style={{ padding: 24 }}>
            <Title level={2}>Course Catalog</Title>
            <Row wrap={true}>
                {courses?.map((course) => (
                    <Col xs={24} sm={12} md={6} lg={6} xl={6} >
                        <Card
                            key={course._id}
                            hoverable
                            style={{ width: 240, height: 320 }}
                            cover={<img alt={course.title} src={course.image} />}
                        >
                            <Meta title={course.title} description={course.description} />
                            <ul>
                                <li><Text>{`Start of Course: ${dayjs(course.startDate,).format('DD/MM/YYYY')}`}</Text></li>
                                <li><Text>{`End of Course: ${dayjs(course.endDate).format('DD/MM/YYYY')}`}</Text></li>
                            </ul>
                            <Link to={`/courses/preview/${course._id}`}><Button type="primary" icon=<EyeOutlined /> >Preview</Button></Link>

                            <Link to='/cart'>
                                <Button type="primary" icon=<DollarCircleOutlined /> >Add to Cart ${course.price}</Button>
                            </Link>

                            <Link to={`/courses/content/${course._id}`}>
                                <Button type="primary" icon=<PlaySquareOutlined /> >Learn</Button>
                            </Link>

                        </Card>
                    </Col>
                ))}
            </Row>

        </Col>
    );
};

export default ShopPage;