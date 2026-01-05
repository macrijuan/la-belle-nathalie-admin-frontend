import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProp } from "../../../redux/sync.js";
import { errs } from "../../../redux/action_names";
import "./confirm_recovery.css";

const ConfirmPasswordRecovery = ( { email } ) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useRef({
    body: { email: email.current, password: "NewPassword1!", password_conf: "NewPassword1!", token: "" },
    handleChange: ( prop, value ) => {
      data.current.body[ prop ] = value;
    },
    handleSubmit: async () => {       
      console.log( data.current.body );
      dispatch( setProp( "loader", [ true ] ) );
      try{
        const res = await fetch(
          `${process.env.SERVER}/user/password_recovery/confirm_recovery`,
          { method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify( data.current.body ) }
        );
        if( res.ok ){
          dispatch( setProp( "message", { éxito: "Ha recuperado su contraseña con éxito!"} ) );
          navigate( "/" );
        }else{
          const err = await res.json().catch( ( _err ) => { console.log( _err ); dispatch( setProp( "message", errs.unknown ) ); } );
          console.log( err.errors );
          dispatch( setProp( "message", err.errors ) );
          if( !( res.status === 403 || res.status === 404 ) ) navigate( "/" );
        };
        console.log( "recived data." );
      }catch( err ){
        console.log( "Did not recive data." );
        console.log( err );
        dispatch( setProp( "message", errs.conn ) );
      };
      dispatch( setProp( "loader", [ false ] ) );
    }
  });

  return(
    <div className="ConfirmPasswordRecovery">
      <div className="header">
        <h1>Recuperación de contraseña: paso 2</h1>
      </div>
      <button className="cancel" onClick={ () => { navigate( "/" ); } } >cancelar</button>
      <p>Hemos enviado un correo a la dirección de correo electrónico "({ email.current })" actualmente asignada a esta cuenta de La Belle Nathalie cuyo contenido es el código que debe escribir aquí abajo para confirmar que usted es el/la dueña.</p>
      <form onSubmit={ ( e ) => { e.preventDefault(); data.current.handleSubmit(); } }>
        <label>Código:</label>
        <input placeholder="código" onChange={ ( e ) => { data.current.handleChange( "token", e.target.value ); } } />
        <br></br>
        <p>Aquí abajo debe escribir la contraseña que reemplazará la actual.</p>
        <label>Nueva contraseña:</label>
        <input placeholder="contraseña" onChange={ ( e ) => { data.current.handleChange( "password", e.target.value ); } } />
        <br></br>
        <label>Repita su nueva contraseña:</label>
        <input placeholder="contraseña" onChange={ ( e ) => { data.current.handleChange( "password_conf", e.target.value ); } } />
        <button type="submit" style={{ marginTop: "2em", display: "block", justifySelf: "center" }}>actualizar</button>
      </form>
      <hr></hr>
    </div>
  );
};

export default ConfirmPasswordRecovery;