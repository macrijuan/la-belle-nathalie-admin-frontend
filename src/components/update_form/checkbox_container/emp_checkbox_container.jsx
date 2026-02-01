import React from "react";
import { normalInput, shiftSelect } from "../../../form_elements/employee_elements.jsx";
import CheckboxOption from "../checkbox_option/checkbox_option.jsx";

const EmpCheckboxContainer = ({ data, selected, setSelected }) => {
  return(
    <div className="ServUpdate-optionBox-container">
      <label>Selecciona la información a actualizar</label>
      <div className="ServUpdate-optionBox">
        <CheckboxOption label="Nombre" selectedKey="first_name"
          chekboxChange={ normalInput }
          body={ data.current.body }
          selected={ selected }
          setSelected={ setSelected }
        />
        <CheckboxOption label="Apellido" selectedKey="last_name"
          chekboxChange={ normalInput }
          body={ data.current.body }
          selected={ selected }
          setSelected={ setSelected }
        />
        <CheckboxOption label="Identidad" selectedKey="identity"
          chekboxChange={ normalInput  }
          body={ data.current.body }
          selected={ selected }
          setSelected={ setSelected }
        />
        <CheckboxOption label="Turno" selectedKey="shift"
          chekboxChange={ shiftSelect }
          body={ data.current.body }
          selected={ selected }
          setSelected={ setSelected }
        />
      </div>
      <button onClick={ () => { data.current.body = {}; setSelected( {} ); } }>deseleccionar todos</button>
    </div>
  );
};

export default EmpCheckboxContainer;