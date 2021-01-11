import { IUser, IUserDocument, IUserModel } from '.';

/**
 *
 * @param query
 * @param skip
 * @param limit
 */
export async function getUsers(query?: unknown, skip = 0, limit = 10): Promise<IUserDocument[]> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const service: IUserModel = this;

    const lQuery = {};

    if (query !== undefined) {
        Object.assign(lQuery, query);
    }

    return service.find(query).skip(skip).limit(limit).exec();
}

/**
 *
 * @param id
 */
export async function getUserById(id: string): Promise<IUserDocument> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const service: IUserModel = this;

    return service.findById(id);
}

/**
 *
 * @param email
 */
export async function getUserByEmail(email: string): Promise<IUserDocument> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const service: IUserModel = this;

    return service.findOne({ email }).exec();
}

/**
 *
 * @param email
 */
export async function getUserByUsername(username: string): Promise<IUserDocument> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const service: IUserModel = this;

    return service.findOne({ username }).exec();
}

/**
 *
 * @param user
 */
export async function createUser(user: IUser): Promise<IUserDocument> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const service: IUserModel = this;

    return service.create(user);
}

/**
 *
 * @param id
 */
export async function deleteUser(id: string): Promise<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const service: IUserModel = this;

    return service.deleteOne({ _id: id });
}
