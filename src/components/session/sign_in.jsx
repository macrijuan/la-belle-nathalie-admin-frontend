import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setProp } from "../../redux/sync.js";
import { actioner, actions, errs } from "../../redux/action_names.js";
import { backgroundManager, getSessionBackgrounds } from "../../images_getter.js";
import { useNavigate, Link } from "react-router-dom";

import "./sign_in.css";

const SignIn = () => {

  const backgrounds = useRef( null );
  const [ selectedBackground, setSelectedBackground ] = useState( null );
  const dispatch = useDispatch();
  
  useEffect( () => {
    backgroundManager( getSessionBackgrounds, "session", backgrounds, setSelectedBackground );
    return () => {
      if( selectedBackground ) URL.revokeObjectURL( selectedBackground.src );
    };
  }, [ window.innerHeight ] );

  const [ state, setState ] = useState( { email:"amacri162013@yahoo.com", password:"Password1" } );
  const [ revPass, setRevPas ] = useState( false );

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try{
      dispatch( setProp( "loader", 1 ) );
      const res = await fetch(`${process.env.SERVER}/admin/sign_in`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( state )
      }).catch( ( err ) => {
        console.log( err );
        dispatch( actioner( actions.SESSION, { errors: errs.conn } ) );
        dispatch( setProp( "loader", 0 ) );
      } );
      if( res ){
        const formatedRes = await res.json();
        if( res.ok ){
          formatedRes.token = res.headers.get('X-Csrf-Token');
          dispatch( actioner( actions.SESSION, formatedRes ) );
          navigate( "/home" );
        }else{
          dispatch( actioner( actions.SESSION, formatedRes ) );
        };
      };
    }catch( err ){
      console.log( err );
      dispatch( setProp( "message", errs.unknown ) );
      dispatch( setProp( "loader", 0 ) );
    };
  };

  const handleInput = ( value, prop ) => {
    state[ prop ] = value;
  };
  
  return(
    <div className="SignIn">
      {
        selectedBackground
          ?<div className="background-container">
            <div className="img-container" style={ selectedBackground.style }>
              <img alt="" src={ selectedBackground.src } style={ selectedBackground.style }/>
            </div>
          </div>
        :null
      }
      <h1>La Belle Nathalie</h1>
      <h2>Manager</h2>
      <h3>Inicia sesión</h3>
      <form onSubmit={ e => { e.preventDefault(); handleSubmit(); } }>
        <h5>Correo</h5>
        <input onChange={ e => { handleInput( e.target.value, "email" ) } } />
        <h5>Contraseña</h5>
        <div style={{ display:"flex", flexDirection:"row" }}>
        {/*change the height of the input below. It's taking the full length instead of its own*/}
        <input onChange={ e => { handleInput( e.target.value, "password" ) } } type={ revPass ?"text" :"password" } />
        <button onClick={ () => { setRevPas( !revPass ) } } type="button" >revelar</button>
        </div>
        <button className="submit" type="submit">iniciar sesión</button>
      </form>
      <Link to="/password_recovery" className="signup">olvidé mi contraseña</Link>
      <hr></hr>
      <Link to="/sign_up" className="signup">crear cuenta</Link>
    </div>
  );
};

export default SignIn;