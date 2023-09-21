const Koa = require("koa");
const bodyParser = require("koa-bodyparser");

const useRouter = require("../router");
const errorHandler = require("./error.handle");
const app = new Koa();

app.useRouter = useRouter;
app.use(bodyParser());
// useRouter被隐式绑定所以里面的this指的是app
app.useRouter();

// 监听错误
app.on("error", errorHandler);

module.exports = app;
