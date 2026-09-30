const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
res.json({
application: "Secure-CICD-Pipeline",
status: "running"
});
});

app.get("/api/health", (req, res) => {
res.json({
status: "ok"
});
});

app.get("/api/products", (req, res) => {
res.json([
{
id: 1,
name: "Laptop",
price: 999
},
{
id: 2,
name: "Keyboard",
price: 79
}
]);
});

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});

