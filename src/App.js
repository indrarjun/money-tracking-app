import { useEffect, useState } from "react";
import "./App.css";
// import { response } from "express";
// require("dotenv").config();

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then((transactions) => {
      setTransactions(transactions);
    });
  }, [transactions]);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    // console.log(url);
    const price = name.split(" ")[0];
    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    }).then((response) => {
      response.json().then((json) => {
        setName("");
        setDatetime("");
        setDescription("");
        console.log("result", json);
      });
    });
  }
  let balance = 0;
  for (const transcation of transactions) {
    balance += transcation.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split(".")[1];
  balance = balance.split(".")[0];
  return (
    <main>
      <h1>
        ${balance} <span>{fraction}</span>
      </h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="+200 new samsung tv"
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
          />
        </div>

        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="Description"
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>

      {/* Transaction details */}
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transcation) => {
            return (
              <div className="transaction">
                <div className="left">
                  <div className="name">{transcation.name}</div>
                  <div className="description">{transcation.description}</div>
                </div>

                <div className="right">
                  <div
                    className={
                      "price " + (transcation.price < 0 ? "red" : "green")
                    }
                  >
                    {transcation.price}
                  </div>
                  <div className="datetime">{transcation.datetime}</div>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}

export default App;
