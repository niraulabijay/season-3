import type { NextPage } from "next";
import { StyleSheet, css } from "aphrodite";
import Image from "next/image";
import land from "../public/land.png";
import factory from "../public/factory.png";
import animals from "../public/animals.png";
import pool from "../public/pool.png";
import pirate from "../public/pirate.png";

const Home: NextPage = () => {
	const styles = Styles();

	return (
		<div className={css(styles.container)}>
			<span className={css(styles.landHolder)}>
				<Image src={land} layout="fill" alt="" priority />
				<div className={css(styles.factory)}>
					<Image src={factory} layout="fill" alt="" priority />
				</div>
				<div className={css(styles.animals)}>
					<Image src={animals} layout="fill" alt="" priority />
				</div>
				<div className={css(styles.pool)}>
					<Image src={pool} layout="fill" alt="" priority />
				</div>
				<div className={css(styles.pirate)}>
					<Image src={pirate} layout="fill" alt="" priority />
				</div>
			</span>
		</div>
	);
};

const Styles = () => {
	const factory = {
		row: 3,
		column: 10,
		width: 2
	};
	const animals = {
		row: 4,
		column: 6,
		width: 2
	};
	const pool = {
		row: 5,
		column: 9,
		width: 2
	};
	const pirate = {
		row: 8,
		column: 3,
		width: 2
	};

	return StyleSheet.create({
		container: {
			display: "flex",
			flex: "1",
			justifyContent: "center",
			alignItems: "center"
		},
		landHolder: {
			display: "grid",
			gridTemplateColumns:
				"1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
			gridTemplateRows: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
			position: "relative",
			width: "786px",
			height: "640px"
		},
		factory: {
			position: "relative",
			//start / end
			gridRow: `${factory.row} / ${factory.row + factory.width}`,
			gridColumn: `${factory.column} / ${factory.column + factory.width}`
		},
		animals: {
			position: "relative",
			//start / end
			gridRow: `${animals.row} / ${animals.row + animals.width}`,
			gridColumn: `${animals.column} / ${animals.column + animals.width}`
		},
		pool: {
			position: "relative",
			//start / end
			gridRow: `${pool.row} / ${pool.row + pool.width}`,
			gridColumn: `${pool.column} / ${pool.column + pool.width}`
		},
		pirate: {
			position: "relative",
			//start / end
			gridRow: `${pirate.row} / ${pirate.row + pirate.width}`,
			gridColumn: `${pirate.column} / ${pirate.column + pirate.width}`
		}
	});
};

export default Home;
