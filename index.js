const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const session = require("express-session");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const AuthRouter = require("./routes/AuthRouter");

dbConnect();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.set("trust proxy", 1); // Bắt buộc khi dùng secure: true trên CodeSandbox (HTTPS proxy)
app.use(session({
  secret: "secretKey",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 3600000, // 1 hour
    sameSite: "none",
    secure: true
  } 
}));

app.use("/admin", AuthRouter);
app.use("/user", AuthRouter); // For POST /user (registration)

const authMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

app.use("/user", authMiddleware, UserRouter);
app.use("/", authMiddleware, PhotoRouter);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
