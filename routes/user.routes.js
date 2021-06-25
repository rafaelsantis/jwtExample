import express from 'express';
import UserController from '../controllers/user.controller.js';
import authorize from "../security/authorize.security.js";

const router = express.Router();

router.get('/', authorize('admin'), UserController.getUsers);
router.post('/', UserController.createUser);
router.post('/login', UserController.login);
router.delete('/:username', UserController.deleteUser);

export default router;