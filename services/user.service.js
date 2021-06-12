import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';

var users = { // Mocked database
  "admin": {
    encryptedPwd: "$2b$04$QND6/T.1ETNkBWjNofdqvuk5dYf91E92gkMSRsh/.SyRUHA6EJB/.",
    role: "admin"
  }
};

async function getUsers() {
  return users;
}

async function createUser(user) {
  const encryptedPwd = bcrypt.hashSync(user.password, 1);
  users[user.username] = {
    encryptedPwd: encryptedPwd,
    role: user.role
  };
  return user;
}

async function login(user) {
  const databaseUser = users[user.username];
  if(databaseUser) {
    const pwdMatches = bcrypt.compareSync(user.password, databaseUser.encryptedPwd);
    if(pwdMatches){
      const privateKey = fs.readFileSync('./security/private.key', 'utf-8');
      var jwtToken = jwt.sign({
        role: databaseUser.role
      }, privateKey,
      {
        expiresIn: 300,
        algorithm: 'RS256'
      });
      return jwtToken;
    } else {
      throw new Error('Ususário não encontrado');
    }
  } else {
    throw new Error('Ususário não encontrado');
  }
}

export default { getUsers, createUser, login };