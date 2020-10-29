let express = require("express");
let path = require("path");
let app = express();
let server = require("http").Server(app);

let io = require("socket.io")(server);

let port = 8080;

app.use("/", express.static(path.join(__dirname, "dist/chatApp")));

let pollObj = {
  question: "Select Your Favourite Component",
  options: [
    { text: "Angular", value: 0, count: 0 },
    { text: "MongoDB", value: 1, count: 0 },
    { text: "Express.js", value: 2, count: 0 },
    { text: "Golang", value: 3, count: 0 },
    { text: "Python", value: 4, count: 0 },
    { text: "C#", value: 5, count: 0 },
    { text: "PhP", value: 6, count: 0 },
    { text: "C++", value: 7, count: 0 },
  ],
};

io.on("connection", socket => {
  console.log("new connection made from client with ID=" + socket.id);
  
  io.sockets.emit('newClinet',pollObj);

  socket.on("newVote", data => {
    io.sockets.emit("vote", addVote(data.vote));
  });
});

server.listen(port, () => {
  console.log("Listening on port " + port);
});

function addVote(vote){
  let newPoll = pollObj;
  for(let num in newPoll.options){
    if(vote == newPoll.options[num].value ){
      newPoll.options[num].count++
    }
  }
  return newPoll;
  
}