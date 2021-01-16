import { Schema } from 'mongoose';
import {
    createUser,
    deleteUser,
    getUserByEmail,
    getUserById,
    getUserByUsername,
    getUsers,
    setUserToken,
    unsetUserToken,
    updateUserProfile,
} from './service';
import { userProfile } from './modules/profile';

export const userSchema = new Schema(
    {
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
        refresh_tokens: {
            type: Array,
            items: {
                token: String,
                validUntil: Date,
            },
            required: false,
        },
        profile: {
            type: userProfile,
        },
    },
    {
        id: true,
        timestamps: true,
    },
);

// Chain model object static functions
userSchema.static('getUsers', getUsers);
userSchema.static('getUserById', getUserById);
userSchema.static('getUserByEmail', getUserByEmail);
userSchema.static('getUserByUsername', getUserByUsername);
userSchema.static('createUser', createUser);
userSchema.static('deleteUser', deleteUser);
userSchema.static('updateUserProfile', updateUserProfile);
userSchema.static('setUserToken', setUserToken);
userSchema.static('unsetUserToken', unsetUserToken);
