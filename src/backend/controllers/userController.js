const { userService } = require('../services');

async function listUsers(req, res) {
  const users = await userService.listUsers();
  res.status(200).json({ users });
}

module.exports = {
  listUsers,
};
