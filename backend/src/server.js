const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const messagesRoutes = require("./routes/messages");
const reportsRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/messages", messagesRoutes);
app.use("/reports", reportsRoutes);
app.use("/auth", authRoutes);
app.use("/ai", aiRoutes);
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Database error");
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});