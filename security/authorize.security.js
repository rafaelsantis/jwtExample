import { promises as fs } from "fs";
import jwt from 'jsonwebtoken';

const { readFile, writeFile } = fs;

function authorize(...allowed) {

  const isAllowed = role => allowed.indexOf(role) > -1;

  return async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json( {message: 'Invalid Bearer token' });
      return;
    }
    const publicKey = await readFile('./security/public.key', 'utf-8');
    const token = authHeader.substring(7, authHeader.length);
    jwt.verify(token, publicKey, {
      algorithms: ['RS256']
    } , function(err, decoded) {
      if(err) {
        res.status(401).json( {message: 'Invalid JWT token' });
        return;
      }
      if (isAllowed(decoded.role)) {
        next();
    } else {
        res.status(401).send('Role not allowed');
    }
    });
  }
}

export default authorize;