import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BoardSelector from "./board/board_selector.jsx";
import PostFormSelector from "../post_form/post_form_selector.jsx";
import { adminSignIn } from "../../redux/post.js";
import { setProp } from "../../redux/sync.js";
import { sessionDel } from "../../redux/delete.js";

import "./home.css";

const Home = () => {

  const [ state, setState ] = useState( { board: "emp", post: 0 } );

  const dispatch = useDispatch();
  const user = useSelector( state => state.user );
  
  useEffect( () => {
    if( !user.email ) dispatch( adminSignIn( { email:"amacri48@yahoo.com", password:"Password1?" } ) );
  }, [ user ] );

  const navigate = useNavigate();

  const data = useRef( {
    handlers:{
      signOut: async () => {
        dispatch( setProp( "loader", 1 ) );
        const res = await dispatch( sessionDel() );
        if( res ) navigate( "/" );
      },
      navToAppoCal: () => { dispatch( setProp( "loader", 1 ) ); navigate( "/appo_calendar" ); }
    }
  } );

  return(
    <div className="Home">
      <div className="Home-header">
        <h1>La Belle Nathalie - Manager</h1>
      </div>
      <div className="Home-inline">
        <button onClick={ () => { navigate( "/account" ); } }>datos de mi cuenta</button>
        <button onClick={ () => { data.current.handlers.signOut(); } }>cerrar sesión</button>
      </div>
      <div className="Home-inline">
        <button onClick={ () => { setState( { ...state, post:"emp" } ); } }>agregar empleado</button>
        <button onClick={ () => { setState( { ...state, post:"serv" } ); } }>agregar servicio</button>
        <button onClick={ () => { setState( { ...state, post:"sub_serv" } ); } }>agregar sub servicio</button>
        <button onClick={ () => {  } }>agregar turno</button>
      </div>
      <div style={{ marginTop: "1em" }}>
        <label className="Home-label">Click para cambiar la información del tablero:</label>
        <select onChange={ ( e ) => { setState( { ...state, board: e.target.value } ); } }>
          <option value="emp" >empleados</option>
          <option value="sub_serv" >sub servicios</option>
          <option value="serv" >servicios</option>
          <option value="appo" >turnos</option>
        </select>
      </div>
      <BoardSelector selectedBoard={ state.board } />
      <PostFormSelector state={ state } setState={ setState } />
    </div>
  );
};

export default Home;