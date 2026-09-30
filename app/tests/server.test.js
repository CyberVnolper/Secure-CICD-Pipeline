const { test, before, after } = require("node:test");
const assert = require("node:assert");

const app = require("../src/server");

let server;
let baseUrl;

before(() => {
server = app.listen(0);
const port = server.address().port;
baseUrl = "http://127.0.0.1:" + port;
});

after(() => {
server.close();
});

test("GET / returns application status", async () => {
const response = await fetch(baseUrl + "/");
const body = await response.json();


assert.strictEqual(response.status, 200);
assert.strictEqual(body.application, "Secure-CICD-Pipeline");
assert.strictEqual(body.status, "running");


});

test("GET /api/health returns ok", async () => {
const response = await fetch(baseUrl + "/api/health");
const body = await response.json();


assert.strictEqual(response.status, 200);
assert.strictEqual(body.status, "ok");


});

test("GET /api/products returns products", async () => {
const response = await fetch(baseUrl + "/api/products");
const body = await response.json();


assert.strictEqual(response.status, 200);
assert.ok(Array.isArray(body));
assert.ok(body.length > 0);


});

test("GET /api/users returns users", async () => {
const response = await fetch(baseUrl + "/api/users");
const body = await response.json();


assert.strictEqual(response.status, 200);
assert.ok(Array.isArray(body));
assert.strictEqual(body[0].username, "admin");


});

test("POST /api/login accepts lab credentials", async () => {
const response = await fetch(baseUrl + "/api/login", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
username: "admin",
password: "Admin123!"
})
});


const body = await response.json();

assert.strictEqual(response.status, 200);
assert.strictEqual(body.authenticated, true);


});

test("GET /api/tools/evaluate works in the controlled lab", async () => {
const response = await fetch(
baseUrl + "/api/tools/evaluate?expression=2%2B2"
);


const body = await response.json();

assert.strictEqual(response.status, 200);
assert.strictEqual(body.result, 4);


});

