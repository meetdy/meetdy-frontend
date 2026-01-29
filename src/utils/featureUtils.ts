import { FILTER_FRIEND } from "./constants";

export function getValueFromKey(type: 'LEFT' | 'RIGHT', key: string) {
  if (type === 'LEFT') {
    return FILTER_FRIEND.FILTER_LEFT.find((ele) => ele.key === key).value;
  }
  if (type === 'RIGHT') {
    return FILTER_FRIEND.FILTER_RIGHT.find((ele) => ele.key === key).value;
  }
}

export function checkIsFriend(user: any, listFriend: any[]) {
    return listFriend.some((friend) => friend._id === user?._id);
}

export function checkIsRequestSentToMe(user: any, listRequest: any[]) {
    return listRequest.some((req) => req._id === user?._id);
}

export function checkIsMyRequestFriend(user: any, listMyRequest: any[]) {
    return listMyRequest.some((req) => req._id === user?._id);
}

export const sortGroup = (value, type) => {
  let tempGroup = [...value];
  if (type) {
    tempGroup.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  } else {
    tempGroup.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }
      return 0;
    });
  }

  return tempGroup;
};

export const checkLeader = (idUser, listConver, idCurrentConver) => {
  const conver = listConver.find((ele) => ele._id === idCurrentConver);
  return conver.leaderId === idUser;
};


