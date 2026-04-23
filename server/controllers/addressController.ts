import Address from "../models/Address.js";
import { Request, Response } from "express";

//Pegar endereço do usuário
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({
      isDefault: -1, //Primeiro por padrão
      createdAt: -1, //Em seguida por data de criação
    });
    res.json({ success: true, data: addresses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Criar novo endereço
export const addAddress = async (req: Request, res: Response) => {
  try {
    const { type, street, city, state, zipCode, country, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const newAddress = await Address.create({
      user: req.user._id,
      type,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || false,
    });
    res.status(201).json({ success: true, data: newAddress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Atualizar endereço
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { type, street, city, state, zipCode, country, isDefault } = req.body;

    let addressItem = await Address.findById(req.params.id);
    if (!addressItem) {
      return res
        .status(404)
        .json({ success: false, message: "Endereço não encontrado" });
    }

    //Garantir que o endereço do usuário seja o proprietário
    if (addressItem.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para atualizar este endereço",
      });
    }

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    addressItem = await Address.findByIdAndUpdate(
      req.params.id,
      {
        user: req.user._id,
        type,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault,
      },
      {
        new: true,
      },
    );
    res.status(201).json({ success: true, data: addressItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Deletar endereço
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Endereço não encontrado" });
    }

    //Garantir que o endereço do usuário seja o proprietário
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para atualizar este endereço",
      });
    }

    await Address.deleteOne();

    res.json({ success: true, message: "Endereço deletado com sucesso" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
