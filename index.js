const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const data = require("./db.json");
const fs = require("fs");

const users = data.users;
const loans = data.loans;
const app = express();
const port = 3000;

app.use(bodyParser.json());
SaveData = (username,email, password) => {
  users.push({
    id: users.length+1,
    username: username,
    email:email,
    Password: password,
  });
  const db = { users };
  fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
    if (err) throw err;
    console.log("db.json has been saved!");
  });
};
app.post("/loans", (req, res) => {
  const { username,status} = req.body;
  const userloans = loans.filter((loan) => loan.username === username && loan.loanStatus === status);
  const response = { data:userloans,total:userloans.length }
  if(userloans.length>0)
    res.status(200).send(response);
  else
    res.status(201).send(response);
});
app.post("/loan", (req, res) => {
  const {loanId} = req.body;
  const loandDetails = loans.filter((loan) => loan.id == loanId);
  if(loandDetails.length>0)
    res.status(200).send(loandDetails);
  else
    res.status(201).send(loandDetails);
});
app.post("/register", (req, res) => {
  const { username,email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  SaveData(username,email, hashedPassword);
  res.status(201).send("User registered successfully");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (user && bcrypt.compareSync(password, user.Password)) {
    const token = jwt.sign({ id: user.username }, "supersecretkey", {
      expiresIn: "1h",
    });
    res.status(200).send({ auth: true, token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
