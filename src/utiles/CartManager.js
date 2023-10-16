import {promises as fs} from 'fs';
import {nanoid} from "nanoid";
import ProductManager from './ProductManager.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productALL = new ProductManager('products.json')
class CartManager{
    constructor(fileName) {
        this.path = path.join(__dirname, fileName);
    }

    readCarts = async()=>{
        let carts = await fs.readFile(this.path, "utf-8")
        return  JSON.parse(carts)
    }

    writeCarts = async (carts)=>{
        await fs.writeFile(this.path,JSON.stringify(carts))
    }

    exist = async(id)=>{
        let carts = await this.readCarts();
        return carts.find(cart =>cart.id === id)
    }
    getCartsById = async (id)=> {
        let cartById= await this.exist(id)
        if(!cartById) return "carrito no encontrado" 
        return cartById
    };

    addCarts = async () => {
        let cartsOLD = await this.readCarts();
        let id = nanoid();
        let newCart = { id: id, products: [] }; 
        let cartsConcat = [newCart, ...cartsOLD];
        await this.writeCarts(cartsConcat);
        return newCart; 
    };

    addProductInCart = async (cartId, productId) => {
        let cartById = await this.exist(cartId);
        if (!cartById) return "Carrito no encontrado";
        let productById = await productALL.exist(productId);
        if (!productById) return "Producto no encontrado";
    
        let cartsALL = await this.readCarts();
        let cartFilter = cartsALL.filter((cart) => cart.id != cartId);
    
        if (cartById.products.some((prod) => prod.id === productId)) {
            let moreproductInCart = cartById.products.find((prod) => prod.id === productId);
            moreproductInCart.quantity += 1;
            let cartsConcat = [cartById, ...cartFilter];
            await this.writeCarts(cartsConcat);
        } else {
            cartById.products.push({ id: productById.id, quantity: 1 });
            let cartsConcat = [cartById, ...cartFilter];
            await this.writeCarts(cartsConcat);
        }
        return cartById;
    };

}

export default CartManager; 