var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var count=0;
var path = require('path');

// Start the Server
http.listen(port, function () {
    console.log('Server Started. Listening on http://localhost:' + port);
});


// const forceSSL = function() {
//     return function (req, res, next) {
//       if (req.headers['x-forwarded-proto'] !== 'https') {
//         return res.redirect(['https://', req.get('Host'), req.url].join(''));
//       }
//       next();
//     }
//   }
  

// app.use(forceSSL());

app.use(express.static(__dirname + '/dist'));
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/TrackApp/index.html'));
});

//SOCKET
io.on('connection', function (socket) {
    console.log('No. of sockets ' + ++count);
    socket.on('disconnect', function() {
      --count;
      console.log('One person disconnected!');
      console.log('Now, no. of sockets : ' + count);
   });
    
   //GETTING DATA FROM THE CLIENTSIDE FRONTEND 
   socket.on("sendMyDetails",(myDetails)=>{
        io.emit(myDetails.name + '-' + myDetails.friendName ,{
            longitude : myDetails.longitude,
            latitude : myDetails.latitude
        });
   })
});
