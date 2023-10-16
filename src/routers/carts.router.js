import { Router} from 'express';
import CartManager  from '../utiles/CartManager.js';

const CartRouter = Router();
const carts = new CartManager('cart.json');


CartRouter.post("/", async (req, res) => {
    const newCart = await carts.addCarts(); 
    res.status(201).json(newCart);
});

CartRouter.get("/" , async (req ,res)=>{
    res.send(await carts.readCarts())
})

CartRouter.get("/:id" , async (req ,res)=>{
    res.send(await carts.getCartsById(req.params.id))
})

CartRouter.post('/:cid/product/:pid', async (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    const updatedCart = await carts.addProductInCart(cartId, productId);
    
    if (updatedCart === "Carrito no encontrado" || updatedCart === "Producto no encontrado") {
        return res.status(404).json({ error: updatedCart });
    }
    
    res.status(200).json(updatedCart);
});

export default CartRouter ;