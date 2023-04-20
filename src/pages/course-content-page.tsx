import { useList, HttpError } from "@refinedev/core";
import ReactPlayer from 'react-player'
import dayjs from "dayjs";
import { Typography } from "antd";
const { Title } = Typography;


interface ICourse {
    _id: number;
    title: string;
    description: string;
    image: string;
    startDate: Date;
    endDate: Date;
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

export const CourseContentPage = (props: any) => {
    const {id}=props;
    const { data, isLoading, isError } = useList<ICourse, HttpError>({
        resource: "courses",
        filters: [
            {
                field: "_id",
                operator: "eq",
                value: id,
            },
        ],
    });

    const courses = data?.data ?? [];
    const course = courses[0];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Something went wrong!</div>;
    }


    //5d93ad92609d4c77cce4224f6119cb7a
    //https://ernest-ga-bucket1.s3.ap-southeast-1.amazonaws.com/tourism01.jpg
    return (
        <>
            <Title level={2}>Course Content Page</Title>
                <div key={course._id}>
                    <Title level={4}>{course.title}</Title>
                    <Title level={5}>{course.description}</Title>
                    <img src={course.image} />
                    <Title level={5}>{`${dayjs(course.startDate)}`}</Title>
                    <div>
                        {course.lessons_id.map((lesson) => (
                            <div>
                                <div>{lesson.title}</div>
                                <p>{lesson.description}</p>
                                <img src={lesson.image} />
                                <ReactPlayer url={lesson.video} />
                                <div>{`${lesson.duration} min`}</div>
                            </div>
                        ))}
                    </div>
                </div>
        </>
    );
};

export default CourseContentPage;