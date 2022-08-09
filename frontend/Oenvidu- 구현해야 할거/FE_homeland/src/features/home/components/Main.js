/* eslint-disable */
import React, { useEffect, useState } from "react";
import Data from "./data.js";
import AOS from "aos";
import "aos/dist/aos.css";
import  Home from "../Home"

function Main() {
  AOS.init({
    duration: 1000,
  });
  const [Notes, NoteChange] = useState(Data);

  return (
    <div>
        <Home></Home>


    </div>
  );
}

export default Main;
