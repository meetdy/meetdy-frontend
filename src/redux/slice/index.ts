import account from "@/redux/slice/accountSlice";
import admin from "@/redux/slice/adminSlice";
import chat from "@/redux/slice/chat/chatSlice";
import media from "@/redux/slice/chat/mediaSlice";
import friend from "@/redux/slice/friendSlice";
import global from "@/redux/slice/globalSlice";
import home from "@/redux/slice/homeSlice";
import socket from "@/redux/slice/socketSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    global,
    account,
    admin,
    friend,
    home,
    chat,
    media,
    socket,
});

export default rootReducer;
