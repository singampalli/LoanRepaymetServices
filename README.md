generate readme for this api
Here's a README file for your API:

markdown
# Loan API

This is a Node.js API for managing loans, including registering and logging in users, and retrieving loan details. The API includes endpoints for user registration, login, retrieving loans by user and status, and retrieving loan details by loan ID.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/loan-api.git
```
Navigate to the project directory:

```sh
cd loan-api
```
Install the dependencies:
```sh
npm install
```
### Running the API
To run the API using nodemon, use the following command:

```sh
npm start
```
The server will start and run on http://localhost:3000.

### API Documentation
The API documentation is available at http://localhost:3000/api-docs once the server is running. The documentation is generated using Swagger and provides details about the available endpoints and their usage.

### Endpoints
### Register a User
URL: /register

Method: POST

Request Body:
```sh
json
{
  "username": "exampleuser",
  "email": "user@example.com",
  "password": "examplepassword"
}
```
Response:

#### 201: User registered successfully

### Login a User
URL: /login
Method: POST
Request Body:

```sh
json
{
  "username": "exampleuser",
  "password": "examplepassword"
}
```
#### 200: Response:

Successful login, returns auth token
401: Invalid credentials

### Retrieve Loans for a User
URL: /loans
Method: POST
Request Body:

```sh
json
{
  "username": "exampleuser",
  "status": "active"
}
```
#### Response:

200: Returns the user's loans and the total count
201: No loans found

### Retrieve Loan Details by Loan ID
URL: /loan
Method: POST
Request Body:

```sh
json
{
  "loanId": 1
}
```
#### Response:

200: Returns the loan details
201: Loan not found

### Dependencies
express
body-parser
jsonwebtoken
bcryptjs
fs
swagger-jsdoc
swagger-ui-express

### Development Dependencies
nodemon

### License
This project is licensed under the MIT License - see the LICENSE file for details.

```sh
Feel free to customize the README file as needed! If you need any further assistance, let me know.
```