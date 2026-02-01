import React, { useState } from "react";

const EmpCurData = ({ state }) => {

  const [ indexToDisplay, setIndexToDisplay ] = useState( 0 );

  return(
    <div className="ServUpdate-current">
      <label>Lista de filas seleccionadas:</label>
      <select onChange={ e => { setIndexToDisplay( e.target.value ); } }>
        {
          state.update.currentData.map( ( o, i ) => ( <option value={ i } key={ i }>{ o.first_name } { o.last_name }</option> ) )
        }
      </select>
      <h2>Información actual</h2>
      <h4>Nombre: { state.update.currentData[ indexToDisplay ].first_name }</h4>
      <h4>Apellido: { state.update.currentData[ indexToDisplay ].last_name }</h4>
      <h4>Identidad: { state.update.currentData[ indexToDisplay ].identity }</h4>
      <h4>Turno: { state.update.currentData[ indexToDisplay ].shift }</h4>
    </div>
  );
};

export default EmpCurData;