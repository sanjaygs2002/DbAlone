const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));

// Disable static file serving to prevent Render errors
const middlewares = jsonServer.defaults({ static: false });
server.use(middlewares);

server.use(jsonServer.bodyParser);
server.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`JSON Server running on port ${PORT}`);
});
