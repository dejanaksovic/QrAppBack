// ESSENTIALS
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./Configs/Config');
const express = require('express');

// Const error handling middleware
const { JsonNotValidMiddleware } = require("./Middleware/ErrorHandleMiddleware");

// ROUTERS
const userRouter = require("./Routers/UserRouter");
const articleRouter = require("./Routers/ArticleRouter");
const transactionsRouter = require("./Routers/TransactionRouter");
const sessionRouter = require("./Routers/SessionRouter");
const categoryRouter = require("./Routers/CategoryRouter");

const app = express();

// CORS OPTIONS
const corsOptions = process.env.ENVIROMENT.toUpperCase() === "DEV" ? null :
{
origin: process.env.FRONT_URL,
methods: "GET, POST, PUT, PATCH, DELETE",
}

app.use(express.urlencoded());
app.use(express.json());
app.use(cors(corsOptions));
app.use(JsonNotValidMiddleware);
// CONNECT TO DB
connectDB(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@clusterqr.ifnvw.mongodb.net/?retryWrites=true&w=majority&appName=ClusterQR`);

// CONNECT ROUTERS
app.use("/users", userRouter);
app.use("/articles", articleRouter);
app.use("/transactions", transactionsRouter);
app.use("/sessions", sessionRouter);
app.use("/categories", categoryRouter);

app.listen(3000, () => {
  console.log("hello");
})