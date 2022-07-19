import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Product from "../../components/Product/Product";
import "./home.css";
const Home = () => {
  const [parentRefresh, setParentRefresh] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <>
      <Navbar parentRefresh={parentRefresh} setParentRefresh={setParentRefresh}/>
      <div className="homeContainer">
        <Product folder={PF} setParentRefresh={setParentRefresh}/>
      </div>
    </>
  );
};

export default Home;
