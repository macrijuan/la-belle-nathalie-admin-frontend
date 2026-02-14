import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postSubServ } from "../../redux/post.js";
import store from "../../redux/store.js";
import { setProp } from "../../redux/sync.js";
import { postSubServVal } from "../../validations/sub_service_val.js";
import { getServs } from "../../redux/get.js";
import "./serv_post.css";

const PostSubServ = ({ state, setState }) => {
  const dispatch = useDispatch();

  const services = useSelector(state => state.services );
  const data = useRef( {
    body:{
      name: "",
      mins: "",
      detail: "",
      serviceId: services && services.length ?services[ 0 ].id :null
    },
    selectedServiceIndex: services && services.length ?0 :null
  } );


  useEffect( () => {
    if( !services.length ){
      dispatch( setProp( "loader", 1  ) );
      dispatch( getServs() );
    };
    if( services.length && !data.current.body.serviceId ){
      data.current.body.serviceId = services[ 0 ].id;
      data.current.selectedServiceIndex = 0;
    };
  }, [ services ] );

  if( services && services.length ) return(
    <div className="PostServ-container" >
      <form className="PostServ"
        onSubmit={ ( e ) => {
          e.preventDefault(); console.log( data.current.body );
          dispatch( setProp( "loader", 1 ) );
          const err = postSubServVal( data.current.body );
          if( err ) {
            dispatch( setProp( "message", err ) );
            dispatch( setProp( "loader", 0 ) );
          }else{
            const _body = { ...data.current.body, mins: Number( data.current.body.mins ), serviceId:Number( data.current.body.serviceId ) };
            dispatch( postSubServ( _body, data.current.selectedServiceIndex ) );
          };
        } }
      >
        <h1>Crear sub servicio</h1>
        <button className="PostServ-cancel" type='button' onClick={ () => { setState( { ...state, post: 0 } ); } } >cerrar</button>
        <h3>Nombre:</h3>
        <input onChange = { ( e ) => { data.current.body.name = e.target.value; } } />
        <h3>Duración (en minutos):</h3>
        <input onChange = { ( e ) => { data.current.body.mins = e.target.value; } } />
        <h3>Detalle (explicación breve del sub servicio):</h3>
        <input onChange = { ( e ) => { data.current.body.detail = e.target.value; } } />
        <h3>Corresponde al servicio:</h3>
        <select onChange = { ( e ) => { console.log( e.target.value ); data.current.body.serviceId = e.target.value; } } >
          { services.map( s => <option key={ s.id } value={ s.id }>{ s.name }</option>) }
        </select>
        
        <button className="PostServ-submit">crear</button>
      </form>
    </div>
  );
  return (
    <div>
      <h3>No hay servicios a los que asignar un sub servicio.</h3>
    </div>
  );
};

export default PostSubServ;