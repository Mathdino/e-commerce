import { Response, Request } from "express";
import Product from "../models/Products.js";
import cloudinary from "../config/cloudinary.js";

//Pegar todos produtos (GET /api/products)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query: any = { isActive: true };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Pegar produto unico (GET /api/products/:id)
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Produto não encontrado" });
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Criar Produto (POST /api/products)
export const createProduct = async (req: Request, res: Response) => {
  try {
    let images = [];

    //Upload files
    if (req.files && (req.files as any).length > 0) {
      const uploadPromises = (req.files as any).map((file: any) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "ecom-app/products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!.secure_url);
            },
          );
          uploadStream.end(file.buffer);
        });
      });
      images = await Promise.all(uploadPromises);
    }

    let sizes = req.body.sizes || [];
    if (typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch (e) {
        sizes = sizes
          .split(",")
          .map((s: string) => s.trim())
          .filter((s: string) => s !== "");
      }
    }
    // Garantir que seja array
    if (!Array.isArray(sizes)) {
      sizes = [sizes];
    }

    const productData = {
      ...req.body,
      images: images,
      sizes,
    };

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Por favor, envie pelo menos uma imagem",
      });
    }
    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Atualizar Produto (PUT /api/products/:id)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    let images: string[] = [];

    if (req.body.existingImages) {
      if (Array.isArray(req.body.existingImages)) {
        images = [...req.body.existingImages];
      } else {
        images = [req.body.existingImages];
      }
    }

    //Upload files
    if (req.files && (req.files as any).length > 0) {
      const uploadPromises = (req.files as any).map((file: any) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "ecom-app/products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!.secure_url);
            },
          );
          uploadStream.end(file.buffer);
        });
      });
      const newImages = await Promise.all(uploadPromises);
      images = [...images, ...newImages];
    }

    const updates = { ...req.body };
    if (req.body.size) {
      let sizes = req.body.sizes;
      if (typeof sizes === "string") {
        try {
          sizes = JSON.parse(sizes);
        } catch (e) {
          sizes = sizes
            .split(",")
            .map((s: string) => s.trim())
            .filter((s: string) => s !== "");
        }
      }
      // Garantir que seja array
      if (!Array.isArray(sizes)) {
        sizes = [sizes];
        updates.sizes = sizes;
      }
    }
    if (
      req.body.existingImages ||
      (req.files && (req.files as any).length > 0)
    ) {
      updates.images = images;
    }

    delete updates.existingImages;

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Produto não encontrado" });
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Deletar produto (DELETE /api/products/:id)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Produto não encontrado" });
    }

    //Deletar images do cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((imageUrl) => {
        const publicIdMatch = imageUrl.match(/\/v\d+\/(.+)\.[a-z]+$/);
        const publicId = publicIdMatch ? publicIdMatch[1] : null;
        if (publicId) {
          return cloudinary.uploader.destroy(publicId);
        }
        return Promise.resolve();
      });
      await Promise.all(deletePromises);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Produto deletado com sucesso" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
