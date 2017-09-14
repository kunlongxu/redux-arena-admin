export default {
  container: {
    background: "#33cc99",
    color: "#fff",
    fontFamily: ["Open Sans", "sans-serif"],
    height: "100vh",
    overflow: "hidden",
    position: "relative"
  },
  c: {
    textAlign: "center",
    display: "block",
    position: "relative",
    width: "80%",
    margin: "100px auto"
  },
  _404: {
    fontSize: "220px",
    position: "relative",
    display: "inline-block",
    zIndex: "2",
    height: "250px",
    letterSpacing: "15px"
  },
  _1: {
    textAlign: "center",
    display: "block",
    position: "relative",
    letterSpacing: "12px",
    fontSize: "4em",
    lineHeight: "80%"
  },
  _2: {
    textAlign: "center",
    display: "block",
    position: "relative",
    fontSize: "20px"
  },
  text: {
    fontSize: "70px",
    textAlign: "center",
    position: "relative",
    display: "inline-block",
    margin: "19px 0px 0px 0px",
    /* top: 256.301px, */
    zIndex: "3",
    width: "100%",
    lineHeight: "1.2em",
    display: "inline-block"
  },
  btn: {
    backgroundColor: "rgb( 255, 255, 255)",
    position: "relative",
    display: "inline-block",
    width: "358px",
    padding: "5px",
    zIndex: "5",
    fontSize: "25px",
    margin: "0 auto",
    color: "#33cc99",
    textDecoration: "none",
    marginRight: "10px"
  },
  right: {
    float: "right",
    width: "60%"
  },
  hr: {
    padding: "0",
    border: "none",
    borderTop: "5px solid #fff",
    color: "#fff",
    textAlign: "center",
    margin: "0px auto",
    width: "420px",
    height: "10px",
    zIndex: "-10",
    "&:after": {
      content: "\\2022",
      display: "inline-block",
      position: "relative",
      top: "-0.75em",
      fontSize: "2em",
      padding: "0 0.2em",
      background: "inherit"
    }
  },
  cloud: {
    width: "350px",
    height: "120px",
    background: "#FFF",
    borderRadius: "100px",
    position: "absolute",
    margin: "120px auto 20px",
    zIndex: "0",
    transition: "ease 1s",

    "&:after,&:before": {
      content: '""',
      position: "absolute",
      background: "#FFF",
      zIndex: "0"
    },

    "&:after": {
      width: "100px",
      height: "100px",
      top: "-50px",
      left: "50px",
      borderRadius: "100px"
    },

    "&:before": {
      width: "180px",
      height: "180px",
      top: "-90px",
      right: "50px",
      borderRadius: "200px"
    }
  },

  x1: {
    top: "-50px",
    left: "100px",
    transform: "scale(0.3)",
    opacity: 0.9,
    animation: "moveclouds 15s linear infinite"
  },

  x1_5: {
    top: "-80px",
    left: "250px",
    transform: "scale(0.3)",
    animation: "moveclouds 17s linear infinite"
  },

  x2: {
    left: "250px",
    top: "30px",
    transform: "scale(0.6)",
    opacity: "0.6",
    animation: "moveclouds 25s linear infinite"
  },

  x3: {
    left: "250px",
    bottom: "-70px",
    transform: "scale(0.6)",
    opacity: 0.8,
    animation: "moveclouds 25s linear infinite"
  },

  x4: {
    left: "470px",
    bottom: "20px",
    transform: "scale(0.75)",
    opacity: "0.75",
    animation: "moveclouds 18s linear infinite"
  },

  x5: {
    left: "200px",
    top: "300px",
    transform: "scale(0.5)",
    opacity: "0.8",
    animation: "moveclouds 20s linear infinite"
  },

  "@keyframes moveclouds": {
    "0%": {
      marginLeft: "1000px"
    },
    "100%": {
      marginLeft: "-1000px"
    }
  }
};
