const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const users = [
{
id: 1,
username: "admin",
role: "administrator"
},
{
id: 2,
username: "victor",
role: "analyst"
}
];

const products = [
{
id: 1,
name: "Laptop",
price: 999
},
{
id: 2,
name: "Keyboard",
price: 79
},
{
id: 3,
name: "Monitor",
price: 249
}
];

app.get("/", (req, res) => {
res.json({
application: "Secure-CICD-Pipeline",
version: "1.0.0",
status: "running"
});
});

app.get("/api/health", (req, res) => {
res.json({
status: "ok"
});
});

app.get("/api/products", (req, res) => {
res.json(products);
});

app.get("/api/users", (req, res) => {
res.json(users);
});

app.post("/api/login", (req, res) => {
const username = req.body.username;
const password = req.body.password;

if (username === "admin" && password === "Admin123!") {
    return res.json({
        authenticated: true,
        username: "admin",
        role: "administrator"
    });
}

return res.status(401).json({
    authenticated: false,
    message: "Invalid credentials"
});

});

app.get("/api/search", (req, res) => {
const query = req.query.q || "";

const results = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
);

// Vulnerabilidad controlada para el laboratorio DAST.
const html =
    "<html>" +
    "<body>" +
    "<h1>Search results</h1>" +
    "<p>Query: " + query + "</p>" +
    "<pre>" + JSON.stringify(results, null, 2) + "</pre>" +
    "</body>" +
    "</html>";

res.send(html);

});

app.get("/api/tools/evaluate", (req, res) => {
const expression = req.query.expression;

if (!expression) {
    return res.status(400).json({
        error: "Missing expression parameter"
    });
}

// VULNERABILIDAD CONTROLADA - SOLO PARA EL LABORATORIO.
const result = eval(expression);

return res.json({
    expression: expression,
    result: result
});

});

app.get("/api/admin", (req, res) => {
res.json({
panel: "admin",
message: "Administrative endpoint",
users: users
});
});

if (require.main === module) {
app.listen(PORT, () => {
console.log("Server running on http://localhost:" + PORT);
});
}

module.exports = app;
