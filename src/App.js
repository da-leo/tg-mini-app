import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card/Card";
import Cart from "./Components/Cart/Cart";
const { getData } = require("./db/db");
const foods = getData();

const tele = window.Telegram.WebApp;

function App() {
  const [cartItems, setCartItems] = useState([]);

  // useEffect(() => {
  //   // const params = new URLSearchParams(window.location.search);
  //   // const startParam = params.get('tgWebAppStartParam');
  //   // console.log('Start parameter:', startParam);
  //   // console.log("params: ", params)

  //   // console.log("init", tele.initData)
  //   // const urlParams = new URLSearchParams(tele.initData);
  //   // const startAppParam = urlParams.get('startapp');
  //   // console.log('Start App Parameter:', startAppParam);
  //   // tele.sendData("12345");
  //   // tele.ready();

    
  // });

  const [userData, setUserData] = useState<UserData | null>(null)
  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData)
    }
  }, [])

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
      // <h1 className="heading">Order Food</h1>
      // <Cart cartItems={cartItems} onCheckout={onCheckout}/>
      // <div className="cards__container">
      //   {foods.map((food) => {
      //     return (
      //       <Card food={food} key={food.id} onAdd={onAdd} onRemove={onRemove} />
      //     );
      //   })}
      // </div>
    <main className="p-4">
      {userData ? (
        <>
          <h1 className="text-2xl font-bold mb-4">User Data</h1>
          <ul>
            <li>ID: {userData.id}</li>
            <li>First Name: {userData.first_name}</li>
            <li>Last Name: {userData.last_name || 'N/A'}</li>
            <li>Username: {userData.username || 'N/A'}</li>
            <li>Language Code: {userData.language_code}</li>
            <li>Is Premium: {userData.is_premium ? 'Yes' : 'No'}</li>
          </ul>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </main>
    </>
  );
}

export default App;
