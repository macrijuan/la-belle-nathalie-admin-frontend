import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProp, setProp2, signOut } from "../../redux/sync.js";
import { appoDel } from "../../redux/delete.js";
import { getAppos } from "../../redux/get.js";
import { adminSignIn } from "../../redux/post.js";
import { config, errs } from "../../redux/action_names.js";
import { backgroundManager, getHomeBackgrounds } from "../../images_getter.js"
import store from "../../redux/store.js";

import "./home.css";

const Home = () => {

  const dispatch = useDispatch();
  const user = useSelector( state => state.user );
  useEffect( () => {
    if( !user.email ) dispatch( adminSignIn( { email:"amacri48@yahoo.com", password:"Password1?" } ) );
    if( !store.getState().appos ) dispatch( getAppos() );
  }, [ user ] );

  const handleDataInTable = ( dataGroup ) => {
    switch( dataGroup ){
      case "appos":{

      }
    };
  };

  return(
    <div className="Home">
      <div className="Home-header">
        <h1>La Belle Nathalie - Manager</h1>
      </div>
      <div className="Home-inline">
        <button>datos de mi cuenta</button>
        <button>cerrar sesión</button>
      </div>
      <div className="Home-inline">
        <button>agergar empleado</button>
        <button>agergar servicio</button>
        <button>agergar sub servicio</button>
        <button>agergar turno</button>
      </div>
      <div style={{ marginTop: "1em" }}>
        <label className="Home-label">Click para cambiar la información de la tabla:</label>
        <select onChange={ ( e ) => { ; } }>
          <option>turnos</option>
          <option>empleados</option>
          <option>servicios</option>
          <option>sub servicios</option>
        </select>
      </div>
    </div>
  );
};

export default Home;