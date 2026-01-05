import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProp, setProp2 } from "../../../redux/sync.js";
import { useNavigate, Link } from "react-router-dom";
import { errs } from "../../../redux/action_names.js";

import "../sign_in.css";

const SignUp = ( { email } ) => {

  useEffect( () => {
    dispatch( setProp( "loader", [ false ] ) );
  }, [] );

  const body = useRef( { token:"", email: email.current, password: "", first_name: "", last_name: "" } );
  const password_conf = useRef( "Asdfgh1!" );
  const [ revPass, setRevPas ] = useState( false );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try{
      if( body.current.password !== password_conf.current ){
        dispatch( setProp( "message", { contraseña: "La contraseña y su confirmación no son iguales."} ) )
        return;
      };
      dispatch( setProp( "loader", [ true ] ) );
      let res = undefined;
      try{
        res = await fetch(`${process.env.SERVER}/user/post_user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify( body.current )
        });
      }catch( err ){
        dispatch( setProp2( { message: errs.conn, loader: 0 } ) );
        return;
      };
      if( res.ok ){
        dispatch( setProp2( { message:{ éxito:"Se ha creado la cuenta." }, loader: 0 } ) );
        navigate( "/" );
      }else{
        const error = await res.json();
        dispatch( setProp2( { message: error.errors, loader: 0 } ) );
      };
    }catch( err ){
      console.log( err );
      dispatch( setProp2( { message: errs.unknown, loader: 0 } ) );
    };
  };

  const handleInput = ( value, prop ) => {
    body.current[ prop ] = value;
  };


  return(
    <div className="SignIn">
      <h1>Crea tu cuenta de La Belle Nathalie</h1>
      <form onSubmit={ e => { e.preventDefault(); handleSubmit(); } }>

        <h5>Código</h5>
        <input onChange= { ( e ) => { handleInput( e.target.value, "token" ); } }/>
        
        <h5>Contraseña</h5>
        <input onChange={ e => { handleInput( e.target.value, "password" ) } } type={ revPass ?"text" :"password" } />
        <button onClick={ () => { setRevPas( !revPass ) } } type="button" >{ revPass ?"ocultar" :"revelar"}</button>

        <h5>Confirme la contraseña</h5>
        <input
          onChange={ e => { password_conf.current = e.target.value; } }
          onPaste={ e => { e.preventDefault(); } }
          type={ revPass ?"text" :"password" }
        />

        <h5>Nombre</h5>
        <input onChange={ e => { handleInput( e.target.value, "first_name" ) } } />

        <h5>Apellido</h5>
        <input onChange={ e => { handleInput( e.target.value, "last_name" ) } } />

        <button className="submit" type="submit">crear cuenta</button>

        <Link to="/">Ya tengo cuenta en La Belle Nathalie</Link>
      </form>
    </div>
  );
};

export default SignUp;