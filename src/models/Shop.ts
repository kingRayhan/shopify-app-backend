import { model, Schema } from "mongoose";

const Shop = model(
  "Shop",
  new Schema(
    {
      domain: String,
      accessToken: String,
      scopes: String,
    },
    { timestamps: true },
  ),
);
export default Shop;
