import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServices } from "../../redux/get.js";
import { setProp } from "../../redux/sync.js";
import { postEmp } from "../../redux/post.js";
import { postEmpVal } from "../../validations/employee_val.js";
import "./serv_post.css";

const PostEmp = ({ state, setState }) => {
  const dispatch = useDispatch();

  const services = useSelector( state => state.services );

  const data = useRef( {
    body:{
      first_name: "",
      last_name: "",
      identity: "",
      shift: "am",
      serviceId: services && services.length ?services[ 0 ].id :null
    },
    selectedServiceIndex: services && services.length ?0 :null
  } );

  useEffect( () => {
    if( !services || !services.length ){
      dispatch( setProp( "loader", 1 ) );
      dispatch( getServices );
    };
    if( services && !data.current.body.serviceId ){
      data.current.body.serviceId = services[ 0 ].id
      data.current.selectedServiceIndex = 0
    };
  }, [ services ] );

  return(
    <div className="PostServ-container" >
      <form className="PostServ"
        onSubmit={ ( e ) => {
          e.preventDefault(); console.log( data.current.body );
          dispatch( setProp( "loader", 1 ) );
          const err = postEmpVal( data.current.body );
          if( err ) {
            dispatch( setProp( "message", err ) );
            dispatch( setProp( "loader", 0 ) );
          }else{
            data.current.body.identity = Number( data.current.body.identity );
            dispatch( postEmp( data.current.body, data.current.selectedServiceIndex ) );
          };
        } }
      >
        <h1>Crear servicio</h1>
        <button className="PostServ-cancel" type='button' onClick={ () => { setState( { ...state, post: 0 } ); } } >cerrar</button>
        <h3>Nombre:</h3>
        <input onChange = { ( e ) => { data.current.body.first_name = e.target.value; } } />
        <h3>Apellido:</h3>
        <input onChange = { ( e ) => { data.current.body.last_name = e.target.value; } } />
        <h3>Identidad:</h3>
        <input onChange = { ( e ) => { data.current.body.identity = e.target.value; } } />
        <h3>Turno laboral:</h3>
        <select onChange = { ( e ) => { data.current.body.shift = e.target.value; } }>
          <option value="am">am</option>
          <option value="pm">pm</option>
        </select>
        <button className="PostServ-submit">crear</button>
      </form>
    </div>
  );
};

export default PostEmp;