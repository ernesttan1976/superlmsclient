import React, {useState} from "react";
import { IResourceComponentsProps} from "@refinedev/core";
import { ShoppingCart, ShoppingCartProvider } from "components/shoppingCartContext";


const ShoppingCartPage: React.FC = () => {
    return (
        <ShoppingCart />
    )
};

export default ShoppingCartPage;

