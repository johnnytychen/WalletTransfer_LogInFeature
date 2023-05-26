import React, { useState, useEffect } from "react";
import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";

const App = () => {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
    }, 1000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleLogin = () => {
    // Send a request to the server to validate the public address and private key
    fetch("http://localhost:3042/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, privateKey }),
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(true);
          return response.json();
        } else if (response.status === 401) {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        } else {
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        setBalance(data.balance);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
        setIsLoggedIn(false);
      });
  };

  const handleLogout = () => {
    // Send a request to the server to log out the user
    fetch("http://localhost:3042/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    })
      .then((response) => {
        if (response.ok) {
          setAddress("");
          setPrivateKey("");
          setIsLoggedIn(false);
        } else {
          throw new Error("Logout failed");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <>
          <Wallet
            balance={balance}
            setBalance={setBalance}
            address={address}
            setAddress={setAddress}
          />
          <Transfer
            setBalance={setBalance}
            address={address}
            privateKey={privateKey}
            setPrivateKey={setPrivateKey}
            handleLogout={handleLogout}
          />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <div className="login">
          <h2>Login</h2>
          <input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Public Address"
          />
          <input
            type="password"
            value={privateKey}
            onChange={(event) => setPrivateKey(event.target.value)}
            placeholder="Private Key"
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default App;
