const userRepository = require('../repositories/userRepository');

async function listUsers() {
  return userRepository.findAll();
}

module.exports = {
  listUsers,
};
