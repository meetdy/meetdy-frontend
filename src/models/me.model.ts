import { IUserProfile } from "@/models/auth.model";

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}

export interface IRevokeTokenResponse {
    token: string;
    refreshToken: string;
}

export interface ICoverImageResponse {
    coverImage: string;
}

export interface IAvatarResponse {
    avatar: string;
}

export type TUpdateProfile = Pick<IUserProfile, "name" | "gender" | "dateOfBirth">;

export type TRevokeToken = {
    password: string;
    key: string;
};
