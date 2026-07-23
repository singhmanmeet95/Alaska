const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecret_jwt_key_for_local_dev';

function generateAuth(context, events, done) {
  // Generate a random user ID between 1 and 100000
  const userId = Math.floor(Math.random() * 100000) + 1;
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  
  // Set the context variables so Artillery can use them
  context.vars = context.vars || {};
  context.vars.token = token;
  context.vars.senderId = userId.toString();
  
  // Also pick a random receiver
  const receiverId = Math.floor(Math.random() * 100000) + 1;
  context.vars.receiverId = receiverId.toString();
  
  return done();
}

module.exports = {
  generateAuth
};
