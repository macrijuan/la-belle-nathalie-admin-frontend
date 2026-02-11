import React, { useState } from "react";

const SubServCurData = ({ state }) => {

  const [ indexToDisplay, setIndexToDisplay ] = useState( 0 );

  return(
    <div className="ServUpdate-current">
      <label>Lista de filas seleccionadas:</label>
      <select onChange={ e => { setIndexToDisplay( e.target.value ); } }>
        {
          state.update.currentData.map( ( o, i ) => ( <option value={ i } key={ i }>{ o.name }</option> ) )
        }
      </select>
      <h2>Información actual</h2>
      <h4>Nombre: { state.update.currentData[ indexToDisplay ].name }</h4>
      <h4>Duración: { state.update.currentData[ indexToDisplay ].mins }</h4>
      <h4>Detalle: { state.update.currentData[ indexToDisplay ].detail }</h4>
      <h4>Servicio asignado: { state.update.currentData[ indexToDisplay ].service.name }</h4>
    </div>
  );
};

export default SubServCurData;