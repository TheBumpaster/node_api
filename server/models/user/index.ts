import { Document, FilterQuery, model, Model } from 'mongoose';
import { userSchema } from './schema';
import { IUserProfile } from './modules/profile';

export interface IUser {
    email: string;
    password: string;
    username: string;
}

export interface IUserDocument extends IUser, Document {
    refresh_token?: { token: string; validUntil: Date }[];
    profile?: IUserProfile;
    createdAt?: string;
    updatedAt?: string;
}

export interface IUserObjectMethods {
    getUsers(query?: FilterQuery<IUserDocument>, skip?: number, limit?: number): Promise<IUserDocument[]>;
    getUserById(id: string): Promise<IUserDocument>;
    getUserByEmail(email: string): Promise<IUserDocument>;
    getUserByUsername(username: string): Promise<IUserDocument>;

    deleteUser(id: string): Promise<unknown>;
    createUser(user: IUser): Promise<IUserDocument>;

    updateUserProfile(id: string, profile: IUserProfile): Promise<IUserDocument>;

    setUserToken(id: string, token: string): Promise<IUserDocument>;
    unsetUserToken(id: string): Promise<IUserDocument>;
}

export type IUserModel = Model<IUserDocument> & IUserDocument & IUserObjectMethods;

export const UserModel: IUserModel = model<IUserDocument>('user', userSchema, 'users') as IUserModel;
