export default {
  pageContainer: null,
  pageWidth: 0,
  pageHeight: 0,
  messageQueue: [],
  snackbarInfo: {
    showFlag: false,
    message: "",
    actionText: null,
    acceptTime: new Date().getTime(),
    startTime: new Date().getTime(),
    closeTime: new Date().getTime()
  },
  isRightDrawerOpen: false,
  rightDrawer: null
};
