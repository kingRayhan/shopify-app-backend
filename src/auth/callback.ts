import { Request, Response } from "express";
import Shopify, { AuthQuery } from "@shopify/shopify-api";
import Shop from "../models/Shop";

export default async function (req: Request, res: Response) {
  try {
    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery,
    );

    const shopExists = await Shop.exists({ domain: session.shop });

    if (!shopExists) {
      const shop = new Shop({
        domain: session.shop,
        accessToken: session.accessToken,
        scopes: session.scope,
      });
      await shop.save();
    }
  } catch (error) {
    console.error("error", error); // in practice these should be handled more gracefully
  }
  return res.redirect(`/?host=${req.query.host}&shop=${req.query.shop}`);
}
