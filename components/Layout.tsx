import { ReactNode, useState, useEffect } from "react";
import { StyleSheet, css } from "aphrodite";
import Head from "next/head";
import Topbar from "./Topbar/Topbar";

interface Props {
	children: ReactNode;
	title?: string;
}

const Layout = ({ children, title = "Defiville" }: Props): JSX.Element => {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(true);
		return () => {
			setLoaded(false);
		};
	}, []);

	const styles = Styles();

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
				<meta
					name="keywords"
					content="NFT, Music, Finance, Investment"
				/>
				<meta name="author" content="TYR" />
			</Head>

			{loaded && (
				<main className={css(styles.mainStyle)}>
					<Topbar />
					{children}
				</main>
			)}
		</>
	);
};

const Styles = () => {
	return StyleSheet.create({
		mainStyle: {
			display: "flex",
			flexDirection: "column",
			height: "100vh",
			minHeight: "100vh",
			width: "100%"
		}
	});
};

export default Layout;
