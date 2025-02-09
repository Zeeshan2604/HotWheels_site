import express from "express";
import pkg from "body-parser";
import morgan from "morgan";
import { connect } from "mongoose";
import cors from "cors";
import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authJwt from "./helpers/jwt.js";
import errorHandler from "./helpers/error-handler.js";

//Routes
import collectionsRoutes from "./routers/collections.js";
import productsRoutes from "./routers/products.js";
import usersRoutes from "./routers/users.js";
import ordersRoutes from "./routers/orders.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { json } = pkg;
const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.static("public"));

// Define API URL constant
const api = process.env.API_URL;

//middleware
app.use(json());
app.use(morgan("tiny"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(`${api}`, authJwt());

// api routes
app.use(`${api}/collections`, collectionsRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//error handling middleware
app.use(errorHandler);

//connect to database
connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
