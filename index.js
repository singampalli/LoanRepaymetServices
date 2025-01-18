const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const data = require("./db.json");
const fs = require("fs");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const users = data.users;
const loans = data.loans;
const app = express();
const port = 3000;

app.use(bodyParser.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: "Loan API",
      version: "1.0.0",
      description: "API for managing loans",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["index.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

SaveData = (username, email, password) => {
  users.push({
    id: users.length + 1,
    username: username,
    email: email,
    Password: password,
  });
  const db = { users };
  fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
    if (err) throw err;
    console.log("db.json has been saved!");
  });
};

/**
 * @swagger
 * /loans:
 *   post:
 *     summary: Retrieve loans for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: No loans found
 */
app.post("/loans", (req, res) => {
  const { username, status } = req.body;
  const userloans = loans.filter((loan) => loan.username === username && loan.loanStatus === status);
  const response = { data: userloans, total: userloans.length }
  if (userloans.length > 0)
    res.status(200).send(response);
  else
    res.status(201).send(response);
});

/**
 * @swagger
 * /loan:
 *   post:
 *     summary: Retrieve loan details by loanId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loanId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Loan not found
 */
app.post("/loan", (req, res) => {
  const { loanId } = req.body;
  const loandDetails = loans.filter((loan) => loan.id == loanId);
  if (loandDetails.length > 0)
    res.status(200).send(loandDetails);
  else
    res.status(201).send(loandDetails);
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  SaveData(username, email, hashedPassword);
  res.status(201).send("User registered successfully");
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
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
