import express from "express";
import winston from "winston";
import accountsRouter from "./routes/account.routes.js"
import userRouter from "./routes/user.routes.js"
import { promises as fs } from "fs";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./doc.js"
import jwt from 'jsonwebtoken'
import database from './db.js';

//generatekey
//http://travistidwell.com/jsencrypt/demo/

const { readFile, writeFile } = fs;

(async () => {

  try {
      const resultado = await database.sync();
      console.log(resultado);
  } catch (error) {
      console.log(error);
  }
})();

global.fileName = "accounts.json";

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: "my-bank-api.log" })
    ],
    format: combine(
        label({ label: "my-bank-api" }),
        timestamp(),
        myFormat
    )
});

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  //console.log("Acessou o Middleware!");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  app.use(cors());
  next();
});
app.use(express.static("public"));

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.use('/user', userRouter);
app.use("/account", authorize('admin'), accountsRouter);

app.listen(3000, async () => {
    try {
        await readFile(global.fileName);
        logger.info("API Started!");
    } catch (err) {
        const initialJson = {
            nextId: 1,
            accounts: []
        }
        writeFile(global.fileName, JSON.stringify(initialJson)).then(() => {
            logger.info("API Started and File Created!");
        }).catch(err => {
            logger.error(err);
        });
    }
});