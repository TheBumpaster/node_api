import * as crypto from 'crypto';

export function hashPassword(password: string): string {
    // salting hash with secrets
    const pwd = process.env.SECRET + password;
    return crypto.createHash('md5').update(pwd).digest('hex');
}

export function createRandomHash(): string {
    return crypto
        .createHash('md5')
        .update(new Date().toDateString() + 'CatsAndDogs')
        .digest('hex');
}

export function validatePassword(password: string, hash: string): boolean {
    const pwd = process.env.SECRET + password;
    return crypto.createHash('md5').update(pwd).digest('hex') === hash;
}
