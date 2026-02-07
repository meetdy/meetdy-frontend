export interface IFriend {
  _id: string;
  avatar: string;
  avatarColor: string;
  name: string;
  username: string;
  isOnline: boolean;
  lastLogin: string;
}

export interface IRequestFriend {
  _id: string;
  avatar: string;
  avatarColor: string;
  name: string;
  username: string;
  numberCommonFriend: number;
  numberCommonGroup: number;
}

export interface ISuggestFriend {
  _id: string;
  name: string;
  username: string;
  dateOfBirth: {
    day: number;
    month: number;
    year: number;
  };
  gender: boolean;
  avatar: string;
  avatarColor: string;
  coverImage: string;
  isAdmin?: boolean;
  phoneBooks?: Array<any>;
  status: string;
  numberCommonGroup: number;
  numberCommonFriend: number;
  total?: number;
}

export interface IContact {
  _id: string;
  name: string;
  username: string;
  dateOfBirth: {
    day: number;
    month: number;
    year: number;
  };
  gender: boolean;
  avatar: string;
  avatarColor: string;
  coverImage: string;
  isAdmin: boolean;
  phoneBooks: Array<any>;
  status: string;
  numberCommonGroup: number;
  numberCommonFriend: number;
  total: number;
}

export type TFetchFriends = {
  name?: string;
};
