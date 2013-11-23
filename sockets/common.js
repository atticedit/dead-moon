exports.connection = function(socket){
  socket.emit('connected', {status: 'connected'});
  socket.on('disconnect', socketDisconnect);
};

function socketDisconnect(){
}
