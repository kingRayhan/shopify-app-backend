import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import AuthModule from "./auth";
import localtunnel from "localtunnel";
import Shop from "./models/Shop";

require("dotenv").config();

const app = express();
app.use(cookieParser());

const { API_KEY, API_SECRET_KEY, SCOPES, HOST, HOST_SCHEME } = process.env;

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST.replace(/https?:\/\//, ""),
  HOST_SCHEME,
  IS_EMBEDDED_APP: true,
  API_VERSION: ApiVersion.January22,
});

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
  });

app.get("/", async (req, res) => {
  const session = await Shopify.Utils.loadOfflineSession(
    req.query.shop as string,
  );

  const alreadyInstalled = await Shop.findOne({ domain: session.shop });
  if (!alreadyInstalled) {
    return res.redirect(`/auth/login`);
  }
  res.json(alreadyInstalled);
});

app.use("/auth", AuthModule);

const port = Number(process.env.PORT) || 4000;
app.listen(port, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  const { url } = await localtunnel({ port, subdomain: "admin-api-xxxx" });
  console.log(`⚡️[server]: Server is running at ${url}`);
});
