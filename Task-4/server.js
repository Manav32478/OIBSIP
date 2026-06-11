const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// simple user store (real dev would use DB)
const users = [];

app.get("/", (req, res) => {
  res.redirect("/login.html");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "mySecretKey",
  resave: false,
  saveUninitialized: true
}));

// REGISTER
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.send("User already exists. Go back.");
  }

  users.push({ username, password });
  res.redirect("/login.html");
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.send("Invalid credentials");
  }

  req.session.user = user;
  res.redirect("/dashboard");
});

// PROTECTED ROUTE
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }

  res.sendFile(path.join(__dirname, "public/dashboard.html"));
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
