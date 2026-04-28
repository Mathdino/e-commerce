import { Request, Response } from "express";
import Wishlist from "../models/Wishlist.js";

// GET /api/wishlist
export const getWishlist = async (req: Request, res: Response) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "products",
      "name price images category isFeatured sizes stock",
    );
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json({ success: true, data: wishlist.products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/wishlist/toggle/:productId
export const toggleWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const idx = wishlist.products.findIndex((p) => p.toString() === productId);
    if (idx >= 0) {
      wishlist.products.splice(idx, 1);
    } else {
      wishlist.products.push(productId as any);
    }

    await wishlist.save();
    await wishlist.populate("products", "name price images category isFeatured sizes stock");

    res.json({ success: true, data: wishlist.products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
