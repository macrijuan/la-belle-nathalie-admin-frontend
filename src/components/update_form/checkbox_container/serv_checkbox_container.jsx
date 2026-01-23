import React from "react";
import { useDispatch } from "react-redux";
import { setProp } from "../../../redux/sync.js";
import { normalInput, betweenTimes } from "../../../form_elements/service_elements.jsx";
import CheckboxOption from "../checkbox_option/checkbox_option.jsx";

const ServCheckboxContainer = ({ data, selected, setSelected }) => {
  return(
    <div className="ServUpdate-optionBox-container">
      <label>Selecciona la información a actualizar</label>
      <div className="ServUpdate-optionBox">
        <CheckboxOption label="Nombre" selectedKey="name"
          chekboxChange={ normalInput }
          body={ data.current.body }
          selected={ selected }
          setSelected={ setSelected }
        />
        <CheckboxOption label="Turno mañana" selectedKey="am"
          chekboxChange={ betweenTimes }
          body={ data.current.body }
          selected={ selected }
          setSelected={ setSelected }
        />
        <CheckboxOption label="Turno tarde" selectedKey="pm"
          chekboxChange={ betweenTimes }
          body={ data.current.body }
          selected={ selected }
          setSelected={ setSelected }
        />
      </div>
      <button onClick={ () => { data.current.body = {}; setSelected( {} ); } }>deseleccionar todos</button>
    </div>
  );
};

export default ServCheckboxContainer;