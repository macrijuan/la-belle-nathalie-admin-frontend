import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProp, setProp2, signOut } from "../../redux/sync.js";
import BoardSelector from "./board/board_selector.jsx";
//appointments
import { getAppos } from "../../redux/get.js";
import { appoDel } from "../../redux/delete.js";
//employees
// import { getAppos } from "../../redux/get.js";
// import { appoDel } from "../../redux/delete.js";
//services
import { getServices } from "../../redux/get.js";
// import { appoDel } from "../../redux/delete.js";
//sub services
// import { getAppos } from "../../redux/get.js";
// import { appoDel } from "../../redux/delete.js";
import { adminSignIn } from "../../redux/post.js";
import { config, errs } from "../../redux/action_names.js";
import { backgroundManager, getHomeBackgrounds } from "../../images_getter.js"
import store from "../../redux/store.js";

import "./home.css";

const Home = () => {

  const [ state, setState ] = useState( "serv" );

  const dispatch = useDispatch();
  const user = useSelector( state => state.user );
  useEffect( () => {
    if( !user.email ) dispatch( adminSignIn( { email:"amacri48@yahoo.com", password:"Password1?" } ) );
  }, [ user ] );

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
        <label className="Home-label">Click para cambiar la información del tablero:</label>
        <select onChange={ ( e ) => { setState( e.target.value ); } }>
          <option value="appo" >turnos</option>
          <option value="emp" >empleados</option>
          <option value="serv" >servicios</option>
        </select>
      </div>
      <BoardSelector selectedBoard={ state } />
    </div>
  );
};

export default Home;