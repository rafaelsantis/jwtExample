import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import userRepository from '../repositories/user.repository.js';

async function getUsers() {
  return await userRepository.getUsers();
}

async function createUser(user) {
  await userRepository.createUser(user);
  return user;
}

async function login(user) {
  const databaseUser = await userRepository.getUserByUsername(user.username);
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