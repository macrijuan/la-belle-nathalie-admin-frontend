import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { options, options2 } from "../../form_elements/service_elements.jsx";
import { postEmp } from "../../redux/post.js";
import { setProp } from "../../redux/sync.js";
import { postEmpVal } from "../../validations/employee_val.js";
import "./serv_post.css";

const PostEmp = ({ state, setState }) => {
  const dispatch = useDispatch();

  const body = useRef( {
    first_name: "Johnny",
    last_name: "example",
    identity: "19283746",
    shift: "am",
  } );

  return(
    <div className="PostServ-container" >
      <form className="PostServ"
        onSubmit={ ( e ) => {
          e.preventDefault(); console.log( body.current );
          dispatch( setProp( "loader", 1 ) );
          const err = postEmpVal( body.current );
          if( err ) {
            dispatch( setProp( "message", err ) );
            dispatch( setProp( "loader", 0 ) );
          }else{
            body.current.identity = Number( body.current.identity );
            dispatch( postEmp( body.current ) );
          };
        } }
      >
        <h1>Crear servicio</h1>
        <button className="PostServ-cancel" type='button' onClick={ () => { setState( { ...state, post: 0 } ); } } >cerrar</button>
        <h3>Nombre:</h3>
        <input onChange = { ( e ) => { body.current.first_name = e.target.value; } } />
        <h3>Apellido:</h3>
        <input onChange = { ( e ) => { body.current.last_name = e.target.value; } } />
        <h3>Identidad:</h3>
        <input onChange = { ( e ) => { body.current.identity = e.target.value; } } />
        <h3>Turno laboral:</h3>
        <select onChange = { ( e ) => { body.current.shift = e.target.value; } }>
          <option value="am">am</option>
          <option value="pm">pm</option>
        </select>
        <button className="PostServ-submit">crear</button>
      </form>
    </div>
  );
};

export default PostEmp;