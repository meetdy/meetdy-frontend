function validURL(str: string) {
  var pattern =
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  return str.match(pattern);
}

export const replaceConentWithouLink = (content: string, replace: string) => {
  return content.replace(replace, '');
};

export const replaceContentToLink = (content: string, replaceArray: string[]) => {
  let tempContent = content.split(' ');

  tempContent.forEach((temp, i, theArray) => {
    for (let index = 0; index < replaceArray.length; index++) {
      if (temp === replaceArray[index]) {
        theArray[
          i
        ] = `<a target="_blank" href ='${replaceArray[index]}'>${replaceArray[index]}</a>`;
      }
    }
  });

  return tempContent.join(' ');
};

export default validURL;
