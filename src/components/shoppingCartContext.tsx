import { Button, Col, Row, Space, Table, Typography } from "antd";
import React, { createContext, useContext, useState } from "react";
import { Link } from "react-router-dom";
const { Title } = Typography;

interface Item {
  id: number;
  name: string;
  price: number;
}

interface ShoppingCartContextType {
  cartItems: Item[];
  addToCart: (item: Item) => void;
  removeFromCart: (item: Item) => void;
  getTotal: () => number;
}

const ShoppingCartContext = createContext<ShoppingCartContextType>({
  cartItems: [],
  addToCart: () => { },
  removeFromCart: () => { },
  getTotal: () => 0,
});

interface Props {
  items: Item[];
  children: React.ReactNode;
}

const ShoppingCartProvider: React.FC<Props> = ({ items, children }) => {
  const [cartItems, setCartItems] = useState<Item[]>([]);

  const addToCart = (item: Item) => {
    if (cartItems.findIndex(cartItem=>(cartItem.id===item.id))!=-1) return;
    //duplicate
    setCartItems([...cartItems, item]);
  };

  const removeFromCart = (item: Item) => {
    const newCartItems = cartItems.filter((cartItem) => cartItem.id !== item.id);
    setCartItems(newCartItems);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <ShoppingCartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, getTotal }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

const ShoppingCart: React.FC = () => {
  const { cartItems, addToCart, removeFromCart, getTotal } = useContext(
    ShoppingCartContext
  );

  const columns = [{
    title: "No",
    dataIndex: "id",
    key: "id",
    render: (_: any, record: Item) => (<Link to={`/courses/preview/${record.id}`}><Button type="primary">View</Button></Link>)
  }, 
  {
    title: "Item",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (_: any, record: Item) => (
      `$${record.price}`
    )
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (_: any, record: Item) => (
      <Button type="primary" onClick={() => removeFromCart(record)}>Remove from cart</Button>
    )
  }]
  const data = cartItems.map((cartItem, index) => (
    {
      id: cartItem.id,
      name: cartItem.name,
      price: cartItem.price
    }));

  return (
    <Space direction="vertical" style={{ padding: 24, width: "80%" }}>
      <Title level={2}>Shopping Cart</Title>
      <Table columns={columns} dataSource={data} />
      <Title level={5}>Total: ${getTotal()}</Title>
    </Space>
  );
};

export { ShoppingCartContext, ShoppingCartProvider, ShoppingCart };
