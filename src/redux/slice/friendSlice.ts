import {
  IContact,
  IFriend,
  IRequestFriend,
  ISuggestFriend,
} from '@/models/friend.model';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Group {
  _id: string;
  name: string;
}

interface FriendState {
  isLoading: boolean;
  requestFriends: IRequestFriend[];
  myRequestFriend: IRequestFriend[];
  friends: IFriend[];
  groups: Group[];
  numberOfNotification: number;
  phoneBook: IContact[];
  suggestFriends: ISuggestFriend[];
}

const initialState: FriendState = {
  isLoading: false,
  requestFriends: [],
  myRequestFriend: [],
  friends: [],
  groups: [],
  numberOfNotification: 0,
  phoneBook: [],
  suggestFriends: [],
};

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFriends: (state, action: PayloadAction<IFriend[]>) => {
      state.friends = action.payload;
    },
    setNewFriend: (state, action: PayloadAction<IFriend>) => {
      const newFriend = action.payload;
      state.friends = [newFriend, ...state.friends];
    },
    setNewRequestFriend: (state, action: PayloadAction<IRequestFriend>) => {
      const newRequestFriend = action.payload;
      state.requestFriends = [newRequestFriend, ...state.requestFriends];
    },
    setRequestFriends: (state, action: PayloadAction<IRequestFriend[]>) => {
      state.requestFriends = action.payload;
    },
    setGroup: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      state.groups = state.groups.filter((ele) => ele._id !== conversationId);
    },
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    setMyRequestFriend: (state, action: PayloadAction<IRequestFriend[]>) => {
      state.myRequestFriend = action.payload;
    },
    setNumberOfNotification: (state, action: PayloadAction<number>) => {
      state.numberOfNotification = action.payload;
    },
    setSuggestFriends: (state, action: PayloadAction<ISuggestFriend[]>) => {
      state.suggestFriends = action.payload;
    },
    updateSuggestFriend: (state, action: PayloadAction<ISuggestFriend[]>) => {
      state.suggestFriends = action.payload;
    },
    updateFriend: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.friends = state.friends.filter((ele) => ele._id !== id);
    },
    updateRequestFriends: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.requestFriends = state.requestFriends.filter(
        (ele) => ele._id !== id,
      );
    },
    updateMyRequestFriend: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.myRequestFriend = state.myRequestFriend.filter(
        (ele) => ele._id !== id,
      );
    },
  },
});

export const {
  setLoading,
  setFriends,
  setNewFriend,
  setNewRequestFriend,
  setRequestFriends,
  setGroup,
  setGroups,
  setMyRequestFriend,
  setNumberOfNotification,
  setSuggestFriends,
  updateSuggestFriend,
  updateFriend,
  updateMyRequestFriend,
  updateRequestFriends,
} = friendSlice.actions;

export default friendSlice.reducer;
