import React from "react";
import { useSelector } from "react-redux";

import "./loader.css";

const Loader = () => {
  const loader = useSelector( state => state.loader );
  if( loader[ 0 ] ) return(
    <div className="Loader">
      <h1>Cargando</h1>
      <h1 className="dot">.</h1>
      <h1 className="dot">.</h1>
      <h1 className="dot">.</h1>
    </div>
  );
};

export default Loader;