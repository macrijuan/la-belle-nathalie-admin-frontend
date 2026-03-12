import React, { useEffect, useState } from "react";
import store from "../../redux/store.js";
import { useSelector, useDispatch } from "react-redux";
import { setProp } from "../../redux/sync.js";
import { getUsers } from "../../redux/get.js";
import "./user_list.css";


const UserList = ({ dateData }) => {

  const [ display, setDisplay ] = useState( 0 );

  const dispatch = useDispatch();

  useEffect( () => {
    const userReq = store.getState().userReq;
    if( !userReq ){
      dispatch( setProp( "loader", 1 ) );
      dispatch( getUsers() );
    };
  }, [] );

  const users = useSelector( state => state.users );
  
  if( display ){
    console.log( "render user list" );
    if( users.length ) return(
      <div className="UserList-container">
        <div className="UserList">
          <div className="UserList-Header">
            <h1>Usuarios</h1>
          </div>

          <button className="UserList-close" onClick={ () => { setDisplay( 0 ); } }>cerrar</button>

          <label>Usuario seleccionado: { dateData.user ?`${dateData.user.first_name} ${dateData.user.last_name} (${dateData.user.id_ref})` :"Ninguno" }</label>

          <div className="UserList-table">
            <div className="UserList-row">
              <h5>Nombre</h5>
              <h5>Apellido</h5>
              <h5>Últimos 6 números del DNI</h5>
              <h5>Email</h5>
            </div>

            {
              users.map( ( u, i ) => (
                <div
                  key={ u.id }
                  className="UserList-row" 
                  onClick={ () => { dateData.user = u; } }
                >
                  <h5>{ u.first_name }</h5>
                  <h5>{ u.last_name }</h5>
                  <h5>{ u.id_ref }</h5>
                  <h5>{ u.email }</h5>
                </div>
              ) )
            }
          </div>
        </div>
      </div>
    );
    return(
      <h3>No hay usuarios a los que asignar un turno.</h3>
    );
  };
  return <button className="UserList-display" onClick={ () => { setDisplay( 1 ); } }>Seleccionar usuario</button>;
};

export default UserList;


console.log( 0%2 );