import { Router } from 'express';
import {nanoid} from "nanoid";
import ProductManager from '../utiles/ProductManager.js';



const ProductRouter = Router();
const product = new ProductManager;

ProductRouter.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = await product.getProducts();
    if (!isNaN(limit)) {
        const limitedProducts = products.slice(0, limit);
        res.send(limitedProducts);
    } else {
        res.send(products);
    }

})

ProductRouter.get("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.getProductsById(id));
})

ProductRouter.put("/:id", async (req, res) => {
    let id = req.params.id;
    let updateProduct = req.body;
    res.send(await product.updateProducts(id, updateProduct));
})

ProductRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.deleteProducts(id));
})



ProductRouter.post("/", async (req, res) => {
    const newProduct = req.body;
    if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
        return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados." });
    }
    newProduct.id = nanoid();
    if (newProduct.status === undefined) {
        newProduct.status = true;
    }

    if (!newProduct.thumbnails) {
        newProduct.thumbnails = [];
    }
    const result = await product.addProducts(newProduct);

    res.status(201).json(result);
});


export default ProductRouter;