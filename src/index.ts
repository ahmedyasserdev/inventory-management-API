import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import customerRouter from "./routes/customer.route";
import userRouter from "./routes/user.route";
import shopRouter from "./routes/shop.route";
import supplierRouter from "./routes/supplier.route";
import loginRouter from "./routes/login.route";
import brandRouter from "./routes/brand.route.";
import categoryRouter from "./routes/category.route";
import productRouter from "./routes/product.route";
import unitRouter from "./routes/unit.route.";
import salesRouter from "./routes/sale.route";



const app = express();
dotenv.config()


app.use(cors());
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.use("/api/v1", customerRouter)
app.use("/api/v1", userRouter)
app.use("/api/v1", shopRouter)
app.use("/api/v1", supplierRouter)
app.use("/api/v1", loginRouter)
app.use("/api/v1", brandRouter)
app.use("/api/v1", categoryRouter)
app.use("/api/v1", productRouter)
app.use("/api/v1", unitRouter)
app.use("/api/v1", salesRouter)

