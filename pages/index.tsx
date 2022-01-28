import type { NextPage } from "next";
import { StyleSheet, css } from "aphrodite";
import Image from "next/image";
import land from "../public/land.png";
import factory from "../public/factory.png";
import animals from "../public/animals.png";
import pool from "../public/pool.png";
import pirate from "../public/pirate.png";
import FactoryModal from "../components/Modals/FactoryModal";
import { useState } from "react";
import AnimalsModal from "../components/Modals/AnimalsModal";
import PirateModal from "../components/Modals/PirateModal";
import PoolModal from "../components/Modals/PoolModal";
import BanyModal from "../components/Modals/BanyModal/BanyModal";
import MintModal from "../components/Modals/MintModal/MintModal";

const Home: NextPage = () => {
  const styles = Styles();
  const [openFactory, setOpenFactory] = useState(false);
  const [openAnimal, setOpenAnimal] = useState(false);
  const [openPool, setOpenPool] = useState(false);
  const [openPirate, setOpenPirate] = useState(false);

  const handleFactoryOpen = () => {
    setOpenFactory(true);
  };
  const handleFactoryClose = () => {
    setOpenFactory(false);
  };
  const handleAnimalOpen = () => {
    setOpenAnimal(true);
  };
  const handleAnimalClose = () => {
    setOpenAnimal(false);
  };
  const handlePoolOpen = () => {
    setOpenPool(true);
  };
  const handlePoolClose = () => {
    setOpenPool(false);
  };
  const handlePirateOpen = () => {
    setOpenPirate(true);
  };
  const handlePirateClose = () => {
    setOpenPirate(false);
  };

  return (
    <>
      <div className={css(styles.container)}>
        <span className={css(styles.landHolder)}>
          <Image src={land} layout="fill" alt="" priority />
          <div className={css(styles.factory)} onClick={handleFactoryOpen}>
            <Image
              src={factory}
              className={css(styles.imageStyle)}
              layout="fill"
              alt=""
              priority
            />
          </div>
          <div className={css(styles.animals)} onClick={handleAnimalOpen}>
            <Image
              src={animals}
              layout="fill"
              alt=""
              priority
              className={css(styles.imageStyle)}
            />
          </div>
          <div className={css(styles.pool)} onClick={handlePoolOpen}>
            <Image
              src={pool}
              layout="fill"
              alt=""
              priority
              className={css(styles.imageStyle)}
            />
          </div>
          <div className={css(styles.pirate)} onClick={handlePirateOpen}>
            <Image
              src={pirate}
              layout="fill"
              alt=""
              priority
              className={css(styles.imageStyle)}
            />
          </div>
        </span>
      </div>

      {/* <FactoryModal isVisible={openFactory} onClose={handleFactoryClose}  /> */}
      <AnimalsModal isVisible={openAnimal} onClose={handleAnimalClose} />
      <PirateModal isVisible={openPirate} onClose={handlePirateClose} />
      {/* <PoolModal isVisible={openPool} onClose={handlePoolClose}  /> */}
      <MintModal isVisible={openPool} onClose={handlePoolClose} />
      <BanyModal isVisible={openFactory} onClose={handleFactoryClose} />
    </>
  );
};

const Styles = () => {
  const factory = {
    row: 3,
    column: 10,
    width: 2,
  };
  const animals = {
    row: 4,
    column: 6,
    width: 2,
  };
  const pool = {
    row: 5,
    column: 9,
    width: 2,
  };
  const pirate = {
    row: 8,
    column: 3,
    width: 2,
  };

  return StyleSheet.create({
    container: {
      display: "flex",
      flex: "1",
      justifyContent: "center",
      alignItems: "center",
    },
    landHolder: {
      display: "grid",
      gridTemplateColumns:
        "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
      gridTemplateRows: "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
      position: "relative",
      width: "786px",
      height: "640px",
    },
    factory: {
      position: "relative",
      //start / end
      gridRow: `${factory.row} / ${factory.row + factory.width}`,
      gridColumn: `${factory.column} / ${factory.column + factory.width}`,
      cursor: "pointer",
    },
    animals: {
      position: "relative",
      //start / end
      gridRow: `${animals.row} / ${animals.row + animals.width}`,
      gridColumn: `${animals.column} / ${animals.column + animals.width}`,
      cursor: "pointer",
    },
    pool: {
      position: "relative",
      //start / end
      gridRow: `${pool.row} / ${pool.row + pool.width}`,
      gridColumn: `${pool.column} / ${pool.column + pool.width}`,
      cursor: "pointer",
    },
    pirate: {
      position: "relative",
      //start / end
      gridRow: `${pirate.row} / ${pirate.row + pirate.width}`,
      gridColumn: `${pirate.column} / ${pirate.column + pirate.width}`,
      cursor: "pointer",
    },
    imageStyle: {
      ":hover": {
        transform: "scale(1.15)",
        transition: "all 0.4s ease-in-out",
      },
    },
  });
};

export default Home;
