import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import customerRouter from "./routes/customer.route";
import userRouter from "./routes/user.route";
import shopRouter from "./routes/shop.route";



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

