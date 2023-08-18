# Northcoders News API

Welcome to Northcoders News!
This is a Reddit like application build specifially for the Northcoders Community where they can share articles, discuss topics, and leave comments and pictures.

# Try It Out

You can access the hosted version of Northcoders News by following this link: https://nc-news-app-wdjy.onrender.com.



# Getting Started

To get started with Northcoders News locally, follow these steps:

Clone the Repository: Begin by cloning this repository to your local machine.

//git clone https://github.com/your-username/northcoders-news.git

Install Dependencies: Navigate to the project directory and install the necessary dependencies.

//cd northcoders-news
//npm install

Seed Local Database: Initialize the local database with sample data.

npm run seed


Configure Environment Variables:

You will need to create 2 .env files.

-env.development
-env.test

In each file you should add 'PGDATABASE=' with the database names which can be found in /db/setup.sql.


Run Tests: Execute the test suite to ensure everything is working correctly.

//npm test

# Prerequisites

Node.js: >= ??
PostgreSQL: >= ??





Create a .env file in the project root for the application's configuration variables. Refer to .env.example for required variables.
Create another .env file in the client directory for client-side configuration. Refer to client/.env.example.
Run Tests: Execute the test suite to ensure everything is working correctly.

sh
Copy code
npm test
Environment Variables
Project Configuration (.env)
DATABASE_URL: Connection URL for your PostgreSQL database.
SECRET_KEY: Secret key for session management and data encryption.
Client Configuration (client/.env)
REACT_APP_API_URL: URL of the API server for the client to communicate with.
Prerequisites
Node.js: >= [Minimum Node.js version]
PostgreSQL: >= [Minimum PostgreSQL version]


Thank you for checking out Northcoders News!

