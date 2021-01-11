import { Document, FilterQuery, model, Model } from 'mongoose';
import { userSchema } from './schema';

export interface IUser {
    email: string;
    password: string;
    username: string;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserObjectMethods {
    getUsers(query?: FilterQuery<IUserDocument>, skip?: number, limit?: number): Promise<IUserDocument[]>;
    getUserById(id: string): Promise<IUserDocument>;
    getUserByEmail(email: string): Promise<IUserDocument>;
    getUserByUsername(username: string): Promise<IUserDocument>;

    deleteUser(id: string): Promise<unknown>;
    createUser(user: IUser): Promise<IUserDocument>;
}

export type IUserModel = Model<IUserDocument> & IUserDocument & IUserObjectMethods;

export const UserModel: IUserModel = model<IUserDocument>('user', userSchema, 'users') as IUserModel;
