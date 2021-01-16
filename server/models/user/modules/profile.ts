import { Schema } from 'mongoose';

const userProfile = new Schema(
    {
        dateOfBirth: Date,
        firstName: String,
        lastName: String,
        phoneNumber: Number,
        avatar: String,
    },
    {
        _id: false,
    },
);

interface IUserProfile {
    dateOfBirth?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: number;
    avatar?: string;
}

export { userProfile, IUserProfile };
