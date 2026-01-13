import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProp } from "../../../redux/sync";
import { config, errs } from "../../../redux/action_names.js";
import "./recovery_request.css";

const PasswordRecoveryReq = ( { email, setStep } ) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useRef({
    handleSubmit: async ( _email ) => {       
      dispatch( setProp( "loader", 1 ) );
      try{
        const res = await fetch(
          `${process.env.SERVER}/user/password_recovery/recovery_request`,
          { method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify( { email: _email } ) }
        );
        if( res.ok ){
          setStep( 2 );
          dispatch( setProp( "loader", 0 ) );
        }else{
          const err = await res.json().catch( ( _err ) => {
            console.log( "Did not recive data." ); console.log( _err ); dispatch( setProp( "message", errs.unknown ) );
          } );
          console.log( err.errors );
          dispatch( setProp( "message", err.errors ) );
          if( !( res.status === 403 || res.status === 404 ) ) navigate( "/" );
        };
        console.log( "recived data." );
      }catch( err ){
        console.log( err );
        dispatch( setProp( "message", errs.conn ) );
      };
      dispatch( setProp( "loader", 0 ) );
    }
  });

  return(
    <div className="PasswordRecoveryReq">
      <div className="header">
        <h1>Recuperación de contraseña: paso 1</h1>
      </div>
      <button className="cancel" onClick = { () => { navigate( "/" ); } } >cancelar</button>
      <p>Escriba la dirección de correo electróico asignada a su cuenta de La Belle Nathalie. Luego presione en enviar.</p>
      <form onSubmit = { ( e ) => { e.preventDefault(); data.current.handleSubmit( email.current ); } } >
        <input onChange = { ( e ) => { email.current = e.target.value; } } name="email"/>
        <button type = "submit" >enviar</button>
      </form>
      <hr></hr>
    </div>
  );
};

export default PasswordRecoveryReq;