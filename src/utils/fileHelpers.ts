const fileHelpers = {
  getFileName: (url: string) => {
    const splitArrayTempt = url.split('/');
    const splitArrayName = splitArrayTempt[3].split('-');
    if (splitArrayName.length === 3) {
      return splitArrayName[2];
    } else {
      let temp = '';
      for (let index = 2; index < splitArrayName.length; index++) {
        temp = temp.concat(splitArrayName[index]);  
      }

      return temp;
    }
  },

  getFileExtension: (fileName: string) => {
    const splitArrayTempt = fileName.split('.');
    return splitArrayTempt[splitArrayTempt.length - 1];
  },

  getBase64: (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  },

  convertDateStringsToServerDateObject: (dateStrings: string[]) => {
    const startTime = dateStrings[0];
    const endTime = dateStrings[1];

    const startTimeTempt = startTime.split('/');
    const endTimeTempt = endTime.split('/');

    return {
      startTime: `${startTimeTempt[2]}-${startTimeTempt[1]}-${startTimeTempt[0]}`,
      endTime: `${endTimeTempt[2]}-${endTimeTempt[1]}-${endTimeTempt[0]}`,
    };
  },
};

export default fileHelpers;
