import User from '../model/user.model.js';
import bcrypt from 'bcrypt';

async function getUsers() {
  return await User.findAll();
}

async function getUserByUsername(username) {
  const users = await User.findAll({
    where: {
      name: username
    }
  });
  if(users.length > 0)
    return users[0];
  else
    return null;
}

async function deleteUser(username) {
  try {
    await User.destroy({
      where: {
        name: username
      }
    });
  } catch(error) {
    throw error;
  }
}

async function createUser ({ username, password, role }) {
  try {
      const resultadoCreate = await User.create({
          name: username,
          encryptedPwd: bcrypt.hashSync(password, 1),
          role: role
      })
      console.log(resultadoCreate);
  } catch (error) {
      throw error;
  }
};

export default { getUsers, createUser, getUserByUsername, deleteUser }