import React, {useState} from "react";
import { IResourceComponentsProps} from "@refinedev/core";
import { ShoppingCart, ShoppingCartProvider } from "components/shoppingCartContext";


interface Item {
  id: number;
  name: string;
  price: number;
}

const ShoppingCartPage: React.FC = () => {
    return (
        <ShoppingCart />
    )
};

export default ShoppingCartPage;

