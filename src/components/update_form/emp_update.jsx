import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import EmpCheckboxContainer from "./checkbox_container/emp_checkbox_container.jsx";
import EmpCurData from "./form_container/current_data_container/emp_current_data.jsx";
import EmpUpdateForm from "./form_container/form/emp_update_form.jsx";
import "./serv_update.css"; //CHECK THIS LINE

const EmpUpdate = ({ state, setState }) => {

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
      <h1>Formulario de actualización de empleados.</h1>
        <button className="ServUpdate-cancel" onClick={() => { handleClose(); } }>cerrar</button>
        <EmpCheckboxContainer data={ data } selected={ selected } setSelected={ setSelected } />
        <div className="ServUpdate-form-container">
          <EmpCurData state={ state } data={ data }/>
          <EmpUpdateForm state={ state } selected={ selected } data={ data } />
        </div>
      </div>
    </div>
  );
};

export default EmpUpdate;