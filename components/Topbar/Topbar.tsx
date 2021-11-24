import { StyleSheet, css } from "aphrodite";
import Image from "next/image";
import logo from "../../public/logo.svg";
import WalletConnect from "./WalletConnect";

const Topbar = () => {
	const styles = Styles();

	return (
		<div className={css(styles.container)} id="topbar">
			<Image src={logo} alt="" />
			<div className={css(styles.rightHolder)}>
				<WalletConnect />
			</div>
		</div>
	);
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

export default Topbar;
