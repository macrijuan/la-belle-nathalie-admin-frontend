import React from "react";
import { useDispatch } from "react-redux";
import { setProp } from "../../../redux/sync.js";
import { normalInput, betweenTimes } from "../../../form_elements/service_elements.jsx";
import CheckboxOption from "../checkbox_option/checkbox_option.jsx";

const ServCheckboxContainer = ({ data, selected, setSelected }) => {
  const dispatch = useDispatch();

  const handleHourShiftSelect = ( startOrEndInd, hhOrMm, value, key, setValue ) => {
    const newTime = hhOrMm === "hh"
      ?`${value}:${data.current.body[ key ][ startOrEndInd ][ 3 ]}${data.current.body[ key ][ startOrEndInd ][ 4 ]}`
    :`${data.current.body[ key ][ startOrEndInd ][ 0 ]}${data.current.body[ key ][ startOrEndInd ][ 1 ]}:${value}`;
    if( ( startOrEndInd === 0 && newTime < data.current.body[ key ][ 1 ] ) || ( startOrEndInd === 1 && data.current.body[ key ][ 0 ] < newTime ) ){
      data.current.body[ key ][ startOrEndInd ] = newTime;
      setValue( value );
    }else{
      dispatch( setProp( "message", { "Horario laboral": "El horario de inicio debe ser menor al de finalización." } ) );
    };
  };

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
          event= { handleHourShiftSelect }
        />
        <CheckboxOption label="Turno tarde" selectedKey="pm"
          chekboxChange={ betweenTimes }
          body={ data.current.body }
          selected={ selected }
          setSelected={ setSelected }
          event= { handleHourShiftSelect }
        />
      </div>
      <button onClick={ () => { data.current.body = {}; setSelected( {} ); } }>deseleccionar todos</button>
    </div>
  );
};

export default ServCheckboxContainer;