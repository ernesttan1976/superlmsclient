import { Button, Col, Row, Space, Table, Typography } from "antd";
import React, { createContext, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { IItem } from "../models"
import { useActiveAuthProvider, useGo, useNotification } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import axios from "axios";

const { Title } = Typography;
const DATA_URI = (process.env.NODE_ENV === 'production') ? process.env.REACT_APP_PRODUCTION_URI : process.env.REACT_APP_DEV_URI;

interface ShoppingCartContextType {
  cartItems: IItem[];
  addToCart: (item: IItem) => void;
  removeFromCart: (item: IItem) => void;
  getTotal: () => number;
}

const ShoppingCartContext = createContext<ShoppingCartContextType>({
  cartItems: [],
  addToCart: () => { },
  removeFromCart: () => { },
  getTotal: () => 0,
});

interface Props {
  items: IItem[];
  children: React.ReactNode;
}

const ShoppingCartProvider: React.FC<Props> = ({ items, children }) => {
  const [cartItems, setCartItems] = useState<IItem[]>([]);

  const addToCart = (item: IItem) => {
    if (cartItems.findIndex(cartItem => (cartItem.id === item.id)) != -1) return;
    //duplicate
    setCartItems([...cartItems, item]);
  };

  const removeFromCart = (item: IItem) => {
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

  //get user data
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const { open } = useNotification();
  const go = useGo();


  if (!user) return <h1>No user, please log in</h1>
  if (!cartItems) return <h1>No cart items, please goto shop page to add to cart</h1>

  const columns = [{
    title: "No",
    dataIndex: "id",
    key: "id",
    render: (i: any, record: IItem) => (i === 0 ? <a>{i}</a> : <Link to={`/courses/preview/${record.id}`}><Button type="primary">View</Button></Link>)
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
    render: (i: any, record: IItem) => (
      (i === 999) ? (`Total $${record.price}`) : (`$${record.price}`)
    )
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (i: any, record: IItem) => {
      if (i === 0) return (<a></a>);
      return (<Button type="primary" onClick={() => removeFromCart(record)}>Remove from cart</Button>)
    }
  }]

  const data = cartItems.map((cartItem, index) => (
    {
      id: cartItem.id,
      name: cartItem.name,
      price: cartItem.price
    }));

  async function enrollUser(user: any, cartItems: any) {
    try {
      console.log(user, cartItems)
      // console.log("List of course ids: ",user?.courses_id?)
      console.log("New courses: ",...cartItems.map((item: any) => item.id))
//...user?.courses_id?._id, 
      const newCourses_id = [...cartItems.map((item: any) => item.id)]
      console.log("Updated courses:", newCourses_id)
      console.log(user)
      const res = await axios.patch(`${DATA_URI}/users/enroll`,
        {
          user: user,
          courses_id: [...newCourses_id]
        })
      console.log("Response: ", res)

      open?.({
        type: "success",
        message: "Success",
        description: `Thank you for your purchase!`,
      })
      // go({
      //   to: `/`,
      //   type: "push",
      // });
      go({
        to: `/courses/content/${cartItems[0]._id}`,
        type: "push",
      });
      return res.data;
    } catch (error) {
      open?.({
        type: "error",
        message: "error",
        description: `There was an error ${error}`,
      })
      return error
    }
  }

  const handleBuy = () => {
    //goto stripe and do the transaction
    // skipped

    //mutate
    //add the course items to the user list
    console.log(user)
    console.log(cartItems)
    enrollUser(user, cartItems);
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
      <Space direction="vertical" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: "100%", height: "100%" }}>
        <Title level={2}>Shopping Cart</Title>
        <Table style={{ display: "flex", flexDirection: "column", width: "80vw" }} columns={columns} dataSource={data} />
        <Title level={5}>Total: ${getTotal()}</Title>
        <Button onClick={() => handleBuy()} type="primary" style={{ alignSelf: "center", width: "100%" }}>Pay</Button>
      </Space>
    </div>
  );
};

export { ShoppingCartContext, ShoppingCartProvider, ShoppingCart };
