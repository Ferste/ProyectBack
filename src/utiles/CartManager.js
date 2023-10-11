import {promises as fs} from 'fs';
import {nanoid} from "nanoid";
import ProductManager from './ProductManager.js';


const productALL = new ProductManager("./src/data/products.json")
class CartManager{
    constructor(dire){
        this.path =dire;
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

    addCarts = async () =>{
        let cartsOLD = await this.readCarts();
        let id = nanoid();
        let cartsConcat= [{id:id, products : []}, ...cartsOLD]
        await this.writeCarts(cartsConcat);
        return "carrito agregado";
    }
    addProductInCart= async (cartId , productId)=>{
        let cartById = await this.exist(cartId)
        if(!cartById) return "carrito no encontrado" 
        let productById = await productALL.exist(productId)
        if(!productById) return "producto no encontrado"

        let cartsALL = await this.readCarts()
        let cartFilter = cartsALL.filter((cart) => cart.id != cartId)

        if (cartById.products.some((prod) => prod.id === productId)) {
            let moreproductInCart = cartById.products.find((prod) => prod.id === productId);
            moreproductInCart.quantity += 1; 
            let cartsConcat = [cartById, ...cartFilter];
            await this.writeCarts(cartsConcat);
            return "Se sumó el producto al carrito";
        }
        cartById.products.push({id: productById.id, quantity: 1})
        let cartsConcat = [cartById, ...cartFilter];
        await this.writeCarts(cartsConcat)
        return "Se agrego al carrito"
    }

}

export default CartManager; 