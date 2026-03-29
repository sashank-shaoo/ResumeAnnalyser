import express from 'express';
import { createOrGetUser, getUserById, updateUser } from '../controllers/userController.js';

const router = express.Router();

// POST /api/users  — create or get user
router.post('/', createOrGetUser);

// GET /api/users/:id  — get user profile
router.get('/:id', getUserById);

// PUT /api/users/:id  — update user profile
router.put('/:id', updateUser);

export default router;
