import Shopify from "@shopify/shopify-api";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  const shop = req.query.shop as string;
  if (!shop) {
    return res.status(403).json({
      message: "shop is required",
    });
  }

  // Remove protocol from shop url
  const __shop = shop.replace(/^https?:\/\//, "").replace("/", "");

  let loginUrl = await Shopify.Auth.beginAuth(
    req,
    res,
    __shop,
    "/auth/callback",
    false,
  );
  return res.redirect(loginUrl);
}
