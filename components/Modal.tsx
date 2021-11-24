import { StyleSheet, css } from "aphrodite";

const Modal = () => {
	const styles = Styles();
	return <div className={css(styles.container)}></div>;
};

const Styles = () => {
	return StyleSheet.create({
		container: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			padding: "1em 2em",
			width: "100%",
			zIndex: 5,
			"@media (max-width: 768px)": {
				flexDirection: "column-reverse",
				padding: "1em"
			}
		},
		rightHolder: {
			display: "flex",
			alignItems: "center",
			":nth-child(n) > p": {
				cursor: "pointer",
				margin: "0 1rem",
				"@media (max-width: 768px)": {
					marginLeft: 0
				}
			}
		}
	});
};

export default Modal;
