import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import isLoggedIn from "./isLoggedIn.jsx";

const http = require("http");
const { Server } = require("socket.io");

app.use(cors());
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// login
app.post("/login", async (req, res) => {
  const data = await fetch(`http://localhost:8080/users/`).then((data) =>
    data.json()
  );
  const user = data.filter((item) => item.username === req.body.username);
  const isAuthed = bcrypt.compareSync(req.body.password, user[0].password)

  if (req.body.length === 0) {
    return res.status(400).send({ err: `incorrect email or password` })
  }
  console.log(isAuthed)
  if (isAuthed) {
    const token = jwt.sign({
      id: user[0].id,
      name: user[0].name,
      username: user[0].username,
      surname: user[0].surname,
      picture: user[0]?.picture
    },
      process.env.SECRET
    );
    res.json({
      id: user[0].id,
      name: user[0].name,
      surname: user[0].surname,
      username: user[0].username,
      picture: user[0]?.picture,
      token
    });

  } else {
    return res.status(400).send(`wrong email or password`)
  }
});


// register user
app.post("/register", async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password);
  const user = {
    name: req.body.name,
    username: req.body.username,
    surname: req.body.surname,
    picture: req.body?.picture,
    email: req.body.email,
    password: hashedPassword
  }
  await fetch("http://localhost:8080/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then(res => res.json())
    .catch(err => alert(err, 'something is wrong'))
});

// verify token
app.get("/verifyToken", async (req, res) => {
  const verify = await isLoggedIn(req);
  res.json({
    verify: verify,
    username: req.token?.username,
    id: req.token?.id,
    picture: req.token?.picture,
    name: req.token?.name,
    surname: req.token?.surname
  });
});


// post products
app.post(`/product/:id?`, async (req, res) => {
  const { user_id, product_id } = req.body;
  await fetch(
    `http://localhost:8080/answers/${req.params.id ? req.params.id : ""}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, product_id, time_created: new Date().toLocaleDateString("LT"), edited: false }),
    }
  );
  res.json({ success: true });
});


// users
app.get("/users/", async (req, res) => {
  const data = await fetch(`http://localhost:8080/users/`).then((data) =>
    data.json()
  );
  const usernames = data.map((data) => {
    return {
      username: data.username,
      id: data.id,
      picture: data.picture
    };
  });
  res.json(usernames);
});


// update picture
app.patch("/updateProfPic/:id", async (req, res) => {
  await fetch(`http://localhost:8080/users/${req.params.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ picture: req.body.picture, edited: true }),
  });
  res.json({ success: true });
});


// sockets

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_notification", (data) => {
    socket.to(data.product_id).emit("receive_notification", data);
  });
});

server.listen(3001, () => {
  console.log("server is running");
});


app.listen(process.env.PORT || 5050, () =>
  console.log(`server is running on ${PORT} port`)
);