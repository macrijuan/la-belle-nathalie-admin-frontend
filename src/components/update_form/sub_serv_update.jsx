import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import SubServCheckboxContainer from "./checkbox_container/sub_serv_checkbox_container.jsx";
import SubServCurData from "./form_container/current_data_container/sub_serv_current_data.jsx";
import SubServUpdateForm from "./form_container/form/sub_serv_update_form.jsx";
import "./serv_update.css"; //CHECK THIS LINE

const SubServUpdate = ({ state, setState }) => {

  const [ selected, setSelected ] = useState( {} ); //html content to udpate the fields selected using the checkboxes.

  const data = useRef({
    body: {},
    selectedServiceInd: null
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
        <SubServCheckboxContainer data={ data } selected={ selected } setSelected={ setSelected } />
        <div className="ServUpdate-form-container">
          <SubServCurData state={ state } data={ data }/>
          <SubServUpdateForm state={ state } selected={ selected } data={ data } />
        </div>
      </div>
    </div>
  );
};

export default SubServUpdate;