import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProp } from "../../redux/sync.js";

import "./alert.css";

const Alert = ({ accept, cancel }) => {
  // console.log( "Alert --> EXECUTED" );
  const dispatch = useDispatch();
  const alert = useSelector( state => state.alert );
  if( alert ){
    const alertKey = Object.keys( alert )[ 0 ];
    return(
      <div className="Alert-Wrap">
        <div className="Alert">
          <h2>{ alertKey }:</h2>
          <h4>{ alert[ alertKey ] }</h4>
          <div className="Alert-buttons">
            <button onClick={ () => { accept(); } }>aceptar</button>
            <button onClick={ () => { if( cancel ) cancel(); else dispatch( setProp( "alert", 0 ) ); } }>cancelar</button>
          </div>
        </div>
      </div>
    );
  };
  return null;
};

export default Alert;