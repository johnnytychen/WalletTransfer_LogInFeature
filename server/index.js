const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

const privateKeys = {
  "0x1": "Ching",
  "0x2": "Johnny",
  "0x3": "Grace",
};

const loggedInUsers = {};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", isAuthenticated, (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  let remainingAmount = amount;
  while (remainingAmount > 0 && balances[sender] > 0) {
    const transferAmount = Math.min(remainingAmount, balances[sender]);
    balances[sender] -= transferAmount;
    balances[recipient] += transferAmount;
    remainingAmount -= transferAmount;
  }

  if (remainingAmount === 0) {
    res.send({ balance: balances[sender], message: "Transfer complete!" });
  } else {
    res.status(400).send({ message: "Not enough funds!" });
  }
});

app.post("/login", (req, res) => {
  const { address, privateKey } = req.body;

  if (privateKeyIsValid(address, privateKey)) {
    loggedInUsers[address] = true;
    const balance = balances[address] || 0;
    res.send({ balance });
  } else {
    res.status(401).send({ message: "Invalid Public Key and Private Key Combination" });
  }
});

app.post("/logout", (req, res) => {
  const { address } = req.body;

  if (loggedInUsers[address]) {
    delete loggedInUsers[address];
    res.sendStatus(200); // Logout successful
  } else {
    res.sendStatus(401); // Unauthorized: User not logged in
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function privateKeyIsValid(address, privateKey) {
  return privateKeys[address] === privateKey;
}

function isAuthenticated(req, res, next) {
  const { sender } = req.body;

  if (loggedInUsers[sender]) {
    next();
  } else {
    res.sendStatus(401); // Unauthorized
  }
}
