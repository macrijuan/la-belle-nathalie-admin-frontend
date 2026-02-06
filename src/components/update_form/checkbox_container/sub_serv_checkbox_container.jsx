import React from "react";
import { normalInput, serviceIdSelect} from "../../../form_elements/.jsx";
import CheckboxOption from "../checkbox_option/checkbox_option.jsx";

const SubServCheckboxContainer = ({ data, selected, setSelected }) => {
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
        <CheckboxOption label="Duración (minutos)" selectedKey="mins"
          chekboxChange={ normalInput }
          body={ data.current.body }
          selected={ selected }
          setSelected={ setSelected }
        />
        <CheckboxOption label="Detalle" selectedKey="detail"
          chekboxChange={ normalInput  }
          body={ data.current.body }
          selected={ selected }
          setSelected={ setSelected }
        />
        <CheckboxOption label="Servicio asignado" selectedKey="serviceId"
          chekboxChange={ serviceIdSelect }
          body={ data }
          selected={ selected }
          setSelected={ setSelected }
        />
      </div>
      <button onClick={ () => { data.current.body = {}; setSelected( {} ); } }>deseleccionar todos</button>
    </div>
  );
};

export default SubServCheckboxContainer;