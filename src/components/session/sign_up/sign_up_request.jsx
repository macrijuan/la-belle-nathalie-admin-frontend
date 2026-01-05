import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProp, setProp2 } from "../../../redux/sync.js";
import { errs } from "../../../redux/action_names.js";

import "../sign_in.css";

const SignUpRequest = ( { setStep, email } ) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = useRef( {
    handlers:{
      submit: async ( _email ) => {
        try{
          dispatch( setProp( "loader", [ true ] ) );
          const res = await fetch(`${process.env.SERVER}/user/post_user/request`,
            {
              method: "POST",
              body: JSON.stringify( { email:_email } ),
              headers:{ "Content-Type":"application/json" }
            }
          ).catch( err => {
            console.log( err );
            dispatch( setProp2( { message: errs.conn, loader: 0 } ) );
            navigate( "/" );
          } );
          if( res ){
            if( res.ok ){
              setStep( 2 );
            }else{
              const body = await res.json();
              dispatch( setProp2( { message: body.errors, loader: [false ] } ) );
              if( res.status === 500 ) navigate( "/" );
            };
          };
        }catch( err ){
          dispatch( setProp2( { message: errs.unknown, loader: 0 } ) );
          navigate( "/" );
        };
      }
    }
  } );
  return(
    <div className="SignIn">
      <h1>La Belle Nathalie</h1>
      <form onSubmit={ ( e ) => { e.preventDefault(); data.current.handlers.submit( email.current ) } }>
        <button className="cancel" type="button" onClick={ () => { navigate( "/" ); } } style={{ alignSelf:"flex-end" }}>cancelar</button>
        <p style={{ alignSelf:"center"}}>Escriba la dirección de correo electrónico que quiere utilizar para crear su cuenta de La Belle Nathalie.</p>
        <div style={{ alignSelf:"center"}}>
          <label>Correo</label>
          <input onChange={ ( e ) => { email.current = e.target.value; } }/>
        </div>
        <button type="submit" style={{ alignSelf:"center", marginTop:"1em"}} >enviar</button>
      </form>
    </div>
  );
};

export default SignUpRequest;