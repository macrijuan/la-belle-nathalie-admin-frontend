import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import AppoCurData from "./form_container/current_data_container/appo_current_data.jsx";
import AppoUpdateForm from "./form_container/form/appo_update_form.jsx";
import "./serv_update.css"; //CHECK THIS LINE

const AppoUpdate = ({ state, setState }) => {

  const [ selected, setSelected ] = useState( {} ); //html content to udpate the fields selected using the checkboxes.

  const data = useRef({
    body: {},
  });

  const handleClose = () => {
    if( Object.keys( selected ).length ) setSelected( {} );
    setState( { ...state, update: null } );
  };

  if( state.update ) return(
    <div className="ServUpdate-container">
      <div className="ServUpdate">
      <h1>Formulario de actualización de turno.</h1>
        <button className="ServUpdate-cancel" onClick={ () => { handleClose(); } }>cerrar</button>
        <div className="ServUpdate-form-container">
          <AppoCurData state={ state } data={ data }/>
          {/* <AppoUpdateForm state={ state } selected={ selected } data={ data } /> */}
        </div>
      </div>
    </div>
  );
};

export default AppoUpdate;