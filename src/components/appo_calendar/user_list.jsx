import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import store from "../../redux/store.js"
import { useSelector } from "react-redux";
import "./user_list.css";


const UserList = ({ shouldDisplay, dateData }) => {

  const users = useSelector( state => state.users );
  
  if( shouldDisplay ){
    if( users.length )return(
      <div className="UserList-container">
        <div className="UserList">
          <div className="UserList-Header">
            <h1>Usuarios</h1>
          </div>
          <Link to="/home">cerrar</Link>
          <label>Usuario seleccionado: { dateData.user ?`${dateData.user.first_name} ${dateData.user.last_name} (${dateData.user.id_ref})` :"Ninguno" }</label>
          <div className="UserList-table">
            <div className="UserList-row">
              <h5>Nombre</h5>
              <h5>Apellido</h5>
              <h5>Últimos 6 números del DNI</h5>
              <h5>Email</h5>
            </div>
            {
              users.map( ( u ) => (
                <div className="UserList-row" onClick={ () => { dateData.user = u; } }>
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
  return null;
};

export default UserList;