import express from 'express';
import ProductRouter from './routers/product.router.js';
import CartRouter from './routers/carts.router.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use("/api/products", ProductRouter)
app.use("/api/carts", CartRouter)


app.listen(PORT, ()=>{
    console.log('Server runnig on http://localhost:8080 ')
})