import React from "react";
import { IResourceComponentsProps, BaseRecord } from "@refinedev/core";
import { useParsed } from "@refinedev/core";
// import slugify from "slugify";

export const ShoppingCartPage = () => {

    const {
        resource,
        action,
        id,
        pathname,
        params,
    } = useParsed();
    
    return (
        <h1>Shopping Cart Page {params?.slug}</h1>
    );
};

export default ShoppingCartPage;