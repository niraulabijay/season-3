import { StyleSheet } from "aphrodite";

export const Styles = () => {
  return StyleSheet.create({
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
    },
    modalTitle: {
      fontWeight: "bold",
      fontSize: "24px",
    },
    modalClose: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },

    title: {
      fontWeight: "bold",
      color: "#000",
    },

    close: {
      color: "#7E7E7E",
      fontSize: "34px",
      cursor: "pointer",
      lineHeight: "100%",
      fontWeight: "bold",
      ":hover": {
        color: "#565656",
      },
    },

    listWrapper: {
      marginTop: "20px",
      minHeight: "200px",
    },
    tokenList: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: "15px 30px",
      cursor: "pointer",
      ":hover": {
        background: "#f4f4f4",
      },
    },
    tokenName: {
      marginLeft: "10px",
      marginRight: "10px",
      fontWeight: "bold",
    },
  });
};
