import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card/Card";
import Cart from "./Components/Cart/Cart";
const { getData } = require("./db/db");
const foods = getData();

const tele = window.Telegram.WebApp;

function handlePost(user_id, inivte) {
  const handlePostAsync = async () => {
    try {
      const response = await fetch('https://6723-8-210-150-3.ngrok-free.app/v1/appParams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user_id,
          inivte: inivte
        }),
      });
      const data = await response.json();
      // 可以在这里处理 response.json() 的结果
    } catch (error) {
      console.error("Fetch Error:", error.message);
      alert("ERROR!!!!");
      alert(error.message);
    }
  };

  handlePostAsync();
}

function initializeApp() {
  tele.ready();
}

function App() {
  const [cartItems, setCartItems] = useState([]);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const inivte = params.get('tgWebAppStartParam');
  const user_id = tele.initDataUnsafe?.user.id;

  if (inivte) {
    // 存在邀请关系
    handlePost(user_id, inivte);
  } else {
    // 不存在邀请关系
    tele.sendData(JSON.stringify({
      user: user_id,
      inivte: ""
    }));
  }

  console.log(params.get('tgWebAppStartParam'));
  console.log(tele.initDataUnsafe?.user.id);

  // tele.ready(); // 不建议在这里调用，因为它应该在所有初始化完成后调用
}, []);

  initializeApp();

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
