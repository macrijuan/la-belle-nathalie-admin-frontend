import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProp, setProp2, signOut } from "../../redux/sync.js";
import BoardSelector from "./board/board_selector.jsx";
import PostFormSelector from "../post_form/post_form_selector.jsx";
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

  const [ state, setState ] = useState( { board: "sub_serv", post: 0 } );

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
        <button onClick={ () => { setState( { ...state, post:"emp" } ); } }>agregar empleado</button>
        <button onClick={ () => { setState( { ...state, post:"serv" } ); } }>agregar servicio</button>
        <button onClick={ () => { setState( { ...state, post:"sub_serv" } ); } }>agregar sub servicio</button>
        <button>agregar turno</button>
      </div>
      <div style={{ marginTop: "1em" }}>
        <label className="Home-label">Click para cambiar la información del tablero:</label>
        <select onChange={ ( e ) => { setState( { ...state, board: e.target.value } ); } }>
          <option value="sub_serv" >sub servicios</option>
          <option value="emp" >empleados</option>
          <option value="appo" >turnos</option>
          <option value="serv" >servicios</option>
        </select>
      </div>
      <BoardSelector selectedBoard={ state.board } />
      <PostFormSelector state={ state } setState={ setState } />
    </div>
  );
};

export default Home;