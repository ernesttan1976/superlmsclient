export interface ICourse {
    _id: number;
    title: string;
    description: string;
    image: string;
    startDate: Date;
    endDate: Date;
    price: number;
    instructor_id: IUser;
    students_id: IUser[];
    lessons_id: ILesson[];
    discussions_id: IDiscussion[];
  }

export interface IUser {
    _id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    avatar: string;
    stripe_account_id: string;
    stripe_seller: string;
    courses_id: ICourse[];
}

export interface ILesson {
    _id: number;
    title: string;
    description: string;
    image: string;
    video: string;
    duration: number;
}

export interface IDiscussion {
    _id: number;
    text: string;
    name: string;
    avatar: string;
}

export interface IItem {
    id: number;
    name: string;
    price: number;
  }

export interface IInstructors {
    _id: string;
    name: string;
}

export interface IOptions {
    label: string;
    value: number;
}