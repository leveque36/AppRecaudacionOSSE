require("dotenv").config();
const express = require("express");
const uploadRouter = require("./src/routes/upload");

const app = express();
app.use(express.json());
app.use("/api", uploadRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
