import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card/Card";
import Cart from "./Components/Cart/Cart";
const { getData } = require("./db/db");
const foods = getData();

const tele = window.Telegram.WebApp;

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [startParam, setStartParam] = useState("");
  const [startAppParam, setStartAppParam] = useState("");

  useEffect(() => {
    tele.ready();
  });

  useEffect(() => {
    // const params = new URLSearchParams(window.location.search);
    // if (params.length > 0) {
    //   const startParam = params.get('tgWebAppStartParam');
    //   console.log('Start parameter:', startParam);
    //   console.log("params: ", params)
    // }
    // // setStartParam(params || '')

    // // console.log("init", tele.initData)
    // const urlParams = new URLSearchParams(tele.initData);
    // const startAppParam = urlParams.get('startapp');
    // console.log('Start App Parameter:', startAppParam);
    // // setStartAppParam(urlParams || '')
    tele.WebApp.sendData("123454555");
    tele.sendData("12345");
  },[]);



  const onAdd = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }]);
    }
  };

  const onRemove = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((x) => x.id !== food.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity - 1 } : x
        )
      );
    }
  };

  const onCheckout = () => {
    tele.MainButton.text = "Pay :)";
    tele.MainButton.show();
  };

  return (
    <>
      <h1 className="heading">Order Food</h1>
      {/* <h1 className="heading">{{startParam}}</h1>
      <h1 className="heading">{{startAppParam}}</h1> */}
      <Cart cartItems={cartItems} onCheckout={onCheckout}/>
      <div className="cards__container">
        {foods.map((food) => {
          return (
            <Card food={food} key={food.id} onAdd={onAdd} onRemove={onRemove} />
          );
        })}
      </div>
    </>
  );
}

export default App;
