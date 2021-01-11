import { Schema } from 'mongoose';
import { createUser, deleteUser, getUserByEmail, getUserById, getUserByUsername, getUsers } from './service';

export const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Chain model object static functions
userSchema.static('getUsers', getUsers);
userSchema.static('getUserById', getUserById);
userSchema.static('getUserByEmail', getUserByEmail);
userSchema.static('getUserByUsername', getUserByUsername);
userSchema.static('createUser', createUser);
userSchema.static('deleteUser', deleteUser);
