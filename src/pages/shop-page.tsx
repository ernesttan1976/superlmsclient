import React from "react";
import { useList, HttpError, useLink, useGo } from "@refinedev/core";
import { useState, useContext } from "react";
import dayjs from "dayjs";
import { Typography, Image, Card, Row, Col,Button, Space, Carousel } from "antd";

import { EyeOutlined, DollarCircleOutlined, PlaySquareOutlined } from '@ant-design/icons'
import { ICourse, IUser, ILesson, IDiscussion } from "../models"
import "./shop-page.module.css"
import { ShoppingCartContext, ShoppingCartProvider, ShoppingCart  } from "components/shoppingCartContext";

const { Title, Text } = Typography;
const { Meta } = Card;

interface Item {
    id: number;
    name: string;
    price: number;
  }

export const ShopPage = () => {
    const go = useGo();
    const {addToCart} = useContext(ShoppingCartContext)
    const Link = useLink();
    const [value, setValue] = useState<string>();
    //this is similar to useQuery from Tanstack Query
    const courseList = useList<ICourse, HttpError>({
        resource: "courses",
        queryOptions: {
            onSuccess: () => {
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


    const onChange = (newValue: string) => {
        console.log(newValue);
        setValue(newValue);
    };

    const courses = data?.data ?? [];
    
    const handleAddToCart = (item: Item)=>{
        addToCart(item);
        go({
            to: "/cart",
            type: "push",
        });
      };

    return (
        <>
            <Col sm={24} style={{width: "100%", height: 220}}>
            <Title style={{padding: 8}} level={2}>Course Catalog</Title>
            <Carousel
                className="carousel"
                style={{height: 200}}
                arrows={true}
                autoplay={true}
                autoplaySpeed={3000}
                centerMode={true}
                centerPadding={'8'}
                cssEase={"ease-in-out"}
                slidesToShow={4}
                slidesToScroll={1}
                speed={1000}
            >
                {courses?.map((course) => (
                    <img key={course._id} alt={course.title} src={course.image} height={150}/>
                ))}
                {courses?.map((course) => (
                    <img key={course._id} alt={course.title} src={course.image} height={150} width={200}/>
                ))}
            </Carousel>
             </Col >
            <Col sm={24} style={{ padding: 24 }}>

                <Space size="large" wrap={true} style={{ justifyContent: "space-around" }}>
                    {courses?.map((course) => (
                        <Col key={course._id} xs={24} sm={12} md={6} lg={6} xl={6} >
                            <Space size="large" >
                                <Card
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
                                                <Button onClick={()=>handleAddToCart({
                                                    id: course._id,
                                                    name: course.title,
                                                    price: course.price,
                                                })} style={{ width: 165 }} type="primary" icon=<DollarCircleOutlined /> >Add to Cart ${course.price}</Button>
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
        </>
    );
};

export default ShopPage;