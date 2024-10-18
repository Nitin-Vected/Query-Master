import express from "express";
import cors from "cors";
import { connectDB } from "./model/connection";
import apiRouter from "./routes/apiRouter";
import { PORT } from "./config";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swaggerConfig";

const app = express();

connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
