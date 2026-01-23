import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import ServCheckboxContainer from "./checkbox_container/serv_checkbox_container.jsx";
import ServUpdateForm from "./form_container/form/serv_update_form.jsx";
import ServCurData from "./form_container/current_data_container/serv_current_data.jsx";
import "./serv_udpate.css";

const ServUpdate = ({ state, setState }) => {

  const [ selected, setSelected ] = useState( {} ); //html content to udpate the fields selected using the checkboxes.

  const data = useRef({
    body: {}
  });

  const handleClose = () => {
    if( Object.keys( selected ).length ) setSelected( {} );
    setState( { ...state, update: null } );
  };

  if( state.update ) return(
    <div className="ServUpdate-container">
      <div className="ServUpdate">
      <h1>Formulario de actualización de servicios.</h1>
        <button className="ServUpdate-cancel" onClick={() => { handleClose(); } }>cerrar</button>
        <ServCheckboxContainer data={ data } selected={ selected } setSelected={ setSelected } />
        <div className="ServUpdate-form-container">
          <ServCurData state={ state } data={ data }/>
          <ServUpdateForm state={ state } selected={ selected } data={ data } />
        </div>
      </div>
    </div>
  );
};

export default ServUpdate;