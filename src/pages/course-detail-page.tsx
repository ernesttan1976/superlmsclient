import React from "react";
import { IResourceComponentsProps, BaseRecord } from "@refinedev/core";
import { useParsed } from "@refinedev/core";
// import slugify from "slugify";

export const CourseDetailPage = () => {

    const {
        resource,
        action,
        id,
        pathname,
        params,
    } = useParsed();
    
    return (
        <h1>Course Detail Page {params?.slug}</h1>
    );
};

export default CourseDetailPage;