export const getSummaryName = (name: string) => {
  if (name) {
    let tempName = name.split(' ');
    let sumary = '';
    if (tempName.length > 1) {
      tempName.forEach((ele, index) => {
        if (index < 2) {
          sumary += ele.substring(0, 1);
        }
      });
    } else {
      sumary += tempName[0].substring(0, 1);
    }
    return sumary;
  }
};

export function calculateResponsiveDrawer(width: number) {
  if (width > 1199) {
    return 30;
  }
  if (width >= 992 && width <= 1199) {
    return 40;
  }
  if (width >= 768 && width <= 991) {
    return 60;
  }
  if (width >= 577 && width <= 767) {
    return 70;
  }
  if (width <= 576) {
    return 80;
  }
}
