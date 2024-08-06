import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card/Card";
import Cart from "./Components/Cart/Cart";
const { getData } = require("./db/db");
const foods = getData();

const tele = window.Telegram.WebApp;


function App() {
  const [cartItems, setCartItems] = useState([]);

useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inivte = params.get('tgWebAppStartParam');
    const user_id = tele.initDataUnsafe?.user.id;
    if (inivte) {
      const handlePost = async () => {
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

          if (!response.ok) { // 检查状态码是否为 2xx
            const errorData = await response.json();
            alert(errorData.message || "An unknown error occurred.");
          }

          const jsonData = await response.json();
          console.log(jsonData);
        } catch (error) {
          console.error("Fetch Error:", error.message);
          alert("ERROR!!!!");
          alert(error.message);
        }
      };
      handlePost();
    } else {
      tele.sendData(JSON.stringify({
        user: user_id,
        inivte: ""
      }));
    }

    alert(params.get('tgWebAppStartParam'));
    alert(tele.initDataUnsafe?.user.id);
    // tele.ready();
}, []);

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
