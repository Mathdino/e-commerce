import { Response, Request } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Products.js";

// Pegar Carrinho (GET /api/cart)
export const getCart = async (req: Request, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price images stock",
    );
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Adicionar ao carrinho (POST /api/cart)
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1, size } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Produto não encontrado" });
    }
    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Quantidade insuficiente" });
    }
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    //Encontrar um item com o mesmo produto e tamanho.
    const existingItem = cart.items.find((item) => {
      return item.product.toString() === productId && item.size === size;
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: productId,
        size,
        quantity,
        price: product.price,
      });
    }

    cart.calculateTotal();
    await cart.save();

    await cart.populate("items.product", "name price images stock");

    res.json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Atualizar item do carrinho (PUT /api/cart/item/:productId)
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { quantity, size } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Carrinho não encontrado" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId && item.size === size,
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item não encontrado" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId,
      );
    } else {
      const product = await Product.findById(productId);
      if (product!.stock < quantity) {
        return res
          .status(400)
          .json({ success: false, message: "Quantidade insuficiente" });
      }
      item.quantity = quantity;
    }

    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.product", "name price images stock");
    res.json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remover item do carrinho (DELETE /api/cart/item/:productId)
export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { size } = req.query;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || !size) {
      return res.status(400).json({
        success: false,
        message: "Carrinho ou tamanho não encontrado",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== req.params.productId || item.size !== size,
    );

    cart.calculateTotal();
    await cart.save();
    await cart.populate("items.product", "name price images stock");
    res.json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Limpar carrinho (DELETE /api/cart)
export const clearCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }
    res.json({ success: true, data: "Carrinho limpo com sucesso" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
