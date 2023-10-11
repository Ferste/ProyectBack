import {promises as fs} from 'fs';
import {nanoid} from "nanoid";
class ProductManager{
    constructor(){
        this.path = "./src/data/products.json"
    }
    readProducts = async()=>{
        let products = await fs.readFile(this.path, "utf-8")
        return  JSON.parse(products)
    }

    writeProducts = async (product)=>{
        await fs.writeFile(this.path,JSON.stringify(product))
    }

    addProducts = async (product) =>{
        let productsOLD = await this.readProducts();
        product.id = nanoid ();
        let productALL= [...productsOLD , product]
        await this.writeProducts(productALL);
        return "Prodcuto agregado";
    }
    getProducts = async ()=> {
        return await this.readProducts()
    };

    deleteProducts = async (id)=> {
        let products = await this.readProducts();
        let existProducts =  products.some(prod =>prod.id === id)
        if (existProducts){
            let filterProducts = products.filter(prod =>prod.id != id)
            await this.writeProducts(filterProducts)
            return "Prodcuto eliminado"
        }
        return "producto inexistente"
    }

    exist = async(id)=>{
        let products = await this.readProducts();
        return products.find(prod =>prod.id === id)
    }
    updateProducts = async (id, product) => {
        let productById = await this.exist(id);
        if (!productById) return "Producto no encontrado";
        let updatedProduct = { ...productById };
        for (const key in product) {
            if (key in updatedProduct && key !== 'id') {
                updatedProduct[key] = product[key];
            }
        }
        const products = await this.readProducts();
        const productIndex = products.findIndex((p) => p.id === id);
        if (productIndex !== -1) {
            products[productIndex] = updatedProduct;
            await this.writeProducts(products);
            return "Producto actualizado";
        }
        return "Producto no encontrado";
    }
    
    getProductsById = async (id)=> {
        let productById= await this.exist(id)
        if(!productById) return "Prodcuto no encontrado" 
        return productById
    };
}

export default ProductManager; 


