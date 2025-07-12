const { createServer } = require("http");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { corsOptions } = require("./config/corsOptions");
const morgan = require("morgan");
const { env } = require("./config/env");
const { apiRouter } = require("./routes");
const { connectDb } = require("./lib/db/connectDb");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleware/errorHandler.middleware");
const { init } = require("./config/init");

connectDb();
init();

const app = express();
const server = createServer(app);

app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api", apiRouter);

app.use(errorHandler);

server.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
