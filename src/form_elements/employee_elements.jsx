import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../redux/store.js";
import { getServices } from "../redux/get.js";
import { setProp } from "../redux/sync.js";

export const normalInput = ( shouldAdd, key, selected, setSelected, body, text ) => {
  if( shouldAdd ){
    body[ key ] = "";
    setSelected( { ...selected, [ key ]: () => (
      <div key={ key } className="ServUpdate-normalInput">
        <h3>{text}</h3>
        <input onChange={ ( e ) => { body[ key ] = e.target.value; } }/>
      </div>
    ) } );
  }else{
    if( key in body ){
      delete body[ key ];
      const remainingKeys = { ...selected };
      delete remainingKeys[ key ];
      setSelected( remainingKeys );
    };
  };
};

export const shiftSelect = ( shouldAdd, key, selected, setSelected, body ) => {
  if( shouldAdd ){
    body[ key ] = "am";
    setSelected( { ...selected, [ key ]: () => (
      <div key={ key }>
        <h3>Turno</h3>
        <select onChange={ ( e ) => { body[ key ] = e.target.value; } }>
          <option value="am">am</option>
          <option value="pm">pm</option>
        </select>
      </div>
    ) } );
  }else{
    if( key in body ){
      delete body[ key ];
      const remainingKeys = { ...selected };
      delete remainingKeys[ key ];
      setSelected( remainingKeys );
    };
  };
};

///////////////////serviceId update section///////////////////
const EmpServIdUpdField = ( { prop, data } ) => {
  const dispatch = useDispatch();
  const services = useSelector( s => s.services );
  const servReq = useSelector( s => s.servReq );

  data.current.body[ prop ] = services && services.length ?services[ 0 ].id :null;
  data.selectedServiceInd = services && services.length ?0 :null;

  useEffect( () => {
    if( !servReq ){
      dispatch( setProp( "loader", 1 ) );
      dispatch( getServices() );
    };
    if( services && services.length ){
      data.current.body[ prop ] = services[ 0 ].id;
      data.selectedServiceInd = 0;
    };
  }, [ servReq ] );

  if( services && services.length ) return (
    <div key={ prop }>
      <h3>Servicio asignado</h3>
      <select onChange={ ( e, i ) => { data.current.body[ prop ] = e.target.value; data.current.selectedServiceInd = i; } }>
        { services.map( s => <option key={ s.id } value={ s.id } >{ s.name }</option>) }
      </select>
    </div>
  );
  return (
    <div key={ prop } >
      <h4>No hay servicios a los que agregar un empleado.</h4>
    </div>
  )
};

export const serviceIdSelect = ( shouldAdd, key, selected, setSelected, data ) => {
  if( shouldAdd ){
    setSelected( { ...selected, [ key ]: () => <EmpServIdUpdField prop={ key } data={ data } /> } );
  }else if( key in data.current.body ){
    console.log( "FALLS HERE" );
    delete data.current.body[ key ];
    const remainingKeys = { ...selected };
    delete remainingKeys[ key ];
    setSelected( remainingKeys );
  };
};