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
      color: "#000",
    },
    subTitle: {
      color: "gray",
      fontSize: "14px",
    },
    input: {
      background: "#F4F4F4",
      border: "none",
      width: "100%",
      // lineHeight: "36px",
      fontSize: "20px",
      borderRadius: "5px",
      marginTop: "8px",
      marginBottom: "8px",
      padding: "8px 16px",
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

    footer: {
      display: "flex",
      justifyContent: "space-around",
      columnGap: "15px",
      marginTop: "30px",
    },
    densed: {
      background: "#4AC8D4",
      color: "#fff",
      fontWeight: "bold",
      borderRadius: "5px",
      flex: "1",
    },
    outlined: {
      border: "1px solid #4AC8D4",
      background: "#fff",
      borderRadius: "5px",
      fontWeight: "bold",
      color: "#4AC8D4",
      flex: "1",
    },
    mintInputWrapper: {
      border: "1px solid #e7e7e7",
      padding: "10px 15px",
      borderRadius: "6px",
      marginTop: "30px",
      marginBottom: "10px",
    },
    mintTitle: {
      fontSize: "14px",
      display: "flex",
      justifyContent: "space-between",
    },
    from: {
      marginRight: "60px",
    },
    mintInnerWrap: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "relative",
    },
    tokenList: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "11px 30px",
      background: "#f4f4f4",
      borderRadius: "30px",
      marginLeft: "15px",
      cursor: "pointer",
    },
    maxBtn: {
      background: "#b9b9b9",
      cursor: "pointer",
      padding: "2px 10px",
      marginLeft: "15px",
      borderRadius: "3px",
      position: "absolute",
      right: "45%",
      fontSize: "14px",
      color: "white",
    },

    tokenName: {
      marginLeft: "10px",
      marginRight: "10px",
      fontWeight: "bold",
    },
    tokenDefaultList: {
      padding: "11px 10px",
      minWidth: "160px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#f4f4f4",
      borderRadius: "30px",
      marginLeft: "15px",
      cursor: "pointer",
    },
  });
};
