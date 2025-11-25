export interface IUserProfile {
    avatar: string;
    avatarColor: string;
    dateOfBirth: {
        day: number;
        month: number;
        year: number;
    };
    gender: boolean;
    isAdmin: boolean;
    isOnline: boolean;
    lastLogin: string;
    name: string;
    phoneBooks: Array<any>;
    username: string;
    _id: string;
    coverImage?: string;
}

export interface IUser {
    _id: string;
    avatar: string;
    name: string;
    username: string;
    isActived: boolean;
}

export type TLogin = {
    username: string;
    password: string;
};

export type TRegister = {
    name: string;
    username: string;
    password: string;
};

export type TConfirmAccount = {
    username: string;
    otp: string;
};

export type TConfirmPassword = {
    username: string;
    otp: string;
    password: string;
};

export interface TLoginResponse {
    token: string;
    refreshToken: string;
}
