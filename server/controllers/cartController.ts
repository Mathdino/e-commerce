import { Response, Request } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Products.js";

// Pegar Carrinho (GET /api/cart)
export const getCart = async (req: Request, res: Response) => {
    try{
        let cart = await Cart.findOne({user: req.user._id}).populate("items.product", "name price images stock");
        if(!cart){
            cart = await Cart.create({user: req.user._id, items: []});
        }
        res.json({success: true, data: cart});
    }catch(error: any){
        res.status(500).json({success: false, message: error.message});
    }
};

// Adicionar ao carrinho (POST /api/cart)
export const addToCart = async (req: Request, res: Response) => {
    try{
        const {productId, quantity = 1, size} = req.body;

        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({success: false, message: "Produto não encontrado"});
        }
        if(product.stock < quantity){
            return res.status(400).json({success: false, message: "Quantidade insuficiente"});
        }
        let cart = await Cart.findOne({user: req.user._id});
        if(!cart){
            cart = new Cart({user: req.user._id, items: []});
        }

        //Encontrar um item com o mesmo produto e tamanho.
        const existingItem = cart.items.find((item) => {
            return item.product.toString() === productId && item.size === size;
        })

        res.json({success: true, data: cart});
    }catch(error: any){
        res.status(500).json({success: false, message: error.message});
    }
};

// Atualizar item do carrinho (PUT /api/cart/item/:productId)
export const updateCartItem = async (req: Request, res: Response) => {
    try{

    }catch(error)
};

// Remover item do carrinho (DELETE /api/cart/item/:productId)
export const removeCartItem = async (req: Request, res: Response) => {
    try{

    }catch(error)
};

// Limpar carrinho (DELETE /api/cart)
export const clearCart = async (req: Request, res: Response) => {
    try{

    }catch(error)
};
