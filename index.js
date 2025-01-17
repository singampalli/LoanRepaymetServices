const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const data = require("./db.json");
const fs = require("fs");

const users = data.users;
const app = express();
const port = 3000;

app.use(bodyParser.json());
saveUsers = (username,email, password) => {
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
app.post("/register", (req, res) => {
  const { username,email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  saveUsers(username,email, hashedPassword);
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
