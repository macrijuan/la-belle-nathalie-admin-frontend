import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServs } from "../../redux/get.js";
import { setProp } from "../../redux/sync.js";
import { postEmp } from "../../redux/post.js";
import { postEmpVal } from "../../validations/employee_val.js";
import "./serv_post.css";

const PostEmp = ({ state, setState }) => {
  const dispatch = useDispatch();

  const services = useSelector( state => state.services );

  const data = useRef( {
    body:{
      first_name: "Juan Andrés",
      last_name: "Macri Ibañez",
      identity: "17465712",
      shift: "am",
      serviceId: services && services.length ?services[ 0 ].id :null
    },
    selectedServiceIndex: services && services.length ?0 :null
  } );

  useEffect( () => {
    if( !services || !services.length ){
      dispatch( setProp( "loader", 1 ) );
      dispatch( getServs() );
    }else if( !data.current.body.serviceId ){
      data.current.body.serviceId = services[ 0 ].id
      data.current.selectedServiceIndex = 0
    };
  }, [ services ] );

  if( services && services.length ) return(
    <div className="PostServ-container" >
      <form className="PostServ"
        onSubmit={ ( e ) => {
          e.preventDefault();
          dispatch( setProp( "loader", 1 ) );
          const err = postEmpVal( data.current.body );
          if( err ){
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
        <h3>Servicio asignado:</h3>
        <select onChange = { ( e ) => { data.current.body.serviceId = Number( e.target.value ); } }>
          { services.map( s => <option key={ s.id } value={ s.id }>{ s.name }</option>) }
        </select>
        <button className="PostServ-submit" type='submit'>crear</button>
      </form>
    </div>
  );
  return (
    <div>
      <h3>No hay servicios a los que asociar personal.</h3>
    </div>
  );
};

export default PostEmp;