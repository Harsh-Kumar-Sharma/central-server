/* eslint-disable */
// const { socketController } = require('../controllers')
const { isMsSQLConnected } = require('../models/index')
const SocketHandler = (socket) => {
  socket.emit('CONNECTION_ID', socket.id)

  // Incoming socket request
  socket.on('REQUEST', async (body) => {
    const { command, token, userId } = body
    if (isMsSQLConnected()) {
      if (!userId) {
        socket.emit('SESSION_INVALID');
        return
      }

      // Verify Token and extract User ID

      // Get User Role
      const role = await socketController.GetUserRole(userId)
      if (!role) {
        socket.emit('SESSION_INVALID');
        return
      }

      // Operations
      switch (command) {
        case 'GET:CLEAR_CHAT':
          socket.emit('CHAT_MESSAGES', []);
          break
      }
    }
  })
};

module.exports = SocketHandler;