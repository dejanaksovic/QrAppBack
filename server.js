// ESSENTIALS
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./Configs/Config');
const express = require('express');

// ROUTERS
const userRouter = require("./Routers/UserRouter");

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
// CONNECT TO DB
connectDB(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@clusterqr.ifnvw.mongodb.net/?retryWrites=true&w=majority&appName=ClusterQR`);

// CONNECT ROUTERS
app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("hello");
})