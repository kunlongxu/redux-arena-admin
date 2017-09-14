import NotMatch from "./NotMatch";

export default {
  Component: NotMatch,
  mapStateToProps: (state, { frame }) => {
    return {
      frameActions: frame.actions
    };
  }
};
