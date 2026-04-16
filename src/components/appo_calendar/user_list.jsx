import React, { useEffect, useState } from "react";
import store from "../../redux/store.js";
import { useDispatch } from "react-redux";
import { setProp } from "../../redux/sync.js";
import { getUsers, handleUserApply } from "./calendar_state_managers.js";
import "./user_list.css";


const UserList = ({ users, selectedUser, dateData, setState }) => {
  console.log( "UserList executed" );

  const [ display, setDisplay ] = useState( 0 );

  const dispatch = useDispatch();

  useEffect( () => {
    console.log( "UserList -> useEffect executed" );
      dispatch( setProp( "loader", 1 ) );
      getUsers( setState, dispatch );
  }, [] );
  
  if( display ){
    if( users.length ){

      return(
      <div className="UserList-container">
        <div className="UserList">
          <div className="UserList-Header">
            <h1>Usuarios</h1>
          </div>

          <button className="UserList-close" onClick={ () => { setDisplay( 0 ); } }>cerrar</button>

          <label>Usuario seleccionado: { selectedUser ?`${selectedUser.first_name} ${selectedUser.last_name} (${selectedUser.id_ref})` :"Ninguno" }</label>

          <div className="UserList-table">
            <div className="UserList-tableHeader">
              <h5>Nombre</h5>
              <h5>Apellido</h5>
              <h5>Últimos 6 números del DNI</h5>
              <h5>Email</h5>
            </div>

            {
              users.map( ( u ) => (
                <div
                  key={ u.id }
                  className="UserList-row" 
                  onClick={ () => { handleUserApply( u, dateData, setState, dispatch ); } }
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
    };
    return(
      <h3>No hay usuarios a los que asignar un turno.</h3>
    );
  };
  return <button className="UserList-display" onClick={ () => { setDisplay( 1 ); } }>Seleccionar usuario</button>;
};

export default React.memo( UserList );