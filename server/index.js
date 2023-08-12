const express = require("express");
const mongoose = require("mongoose");
const router = require("./router");
const system = require("./system/bot");
const UserService = require("./service/user");
const SettingService = require("./service/setting");

const app = express();
const dotenv = require('dotenv');
dotenv.config();

const cors = require("cors");
const cron = require("node-cron")

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var path = require('path');

const server = require('http').createServer(app);

var io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
})

io.on("connection", socket => {
  // console.log(socket.handshake.auth.userId)

  socket.on("addUser", userId => {
    UserService.updateUser(userId, {socket_id: socket.id})
  })
})

system.updatePrice(io);
// * * 7 : every sunday

// every hour
cron.schedule('0 0 */1 * * *', () => {
  
  system.roundCheckBot(io);
  
});

// every 10 min
// cron.schedule('* * * * *', () => {
  
//   system.roundCheckBot(io);
  
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect("mongodb+srv://price:123456789LionKing@cluster0.epz612r.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => {
    
    app.use(express.json());
    app.use("/api", router);

    SettingService.initSettingInfo();

    server.listen(5000, () => {
      console.log("Server has started!");
    });
  });
