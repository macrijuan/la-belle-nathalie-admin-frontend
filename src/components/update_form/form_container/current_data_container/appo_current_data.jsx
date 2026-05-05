import React, { useState } from "react";

const AppoCurData = ({ state }) => {

  const [ indexToDisplay, setIndexToDisplay ] = useState( 0 );

  return(
    <div className="ServUpdate-current">
      <label>Lista de filas seleccionadas:</label>
      <select onChange={ e => { setIndexToDisplay( e.target.value ); } }>
        {
          state.update.currentData.map( ( o, i ) => ( <option value={ i } key={ i }>{ o.day } { o.start_time }</option> ) )
        }
      </select>
      <h2>Información actual</h2>
      <h4>Día: { state.update.currentData[ indexToDisplay ].day }</h4>
      <h4>Hora de inicio: { state.update.currentData[ indexToDisplay ].start_time }</h4>
      <h4>Hora de finalización: { state.update.currentData[ indexToDisplay ].end_time }</h4>
      {/* <h4>Sub servicios asignados: { state.update.currentData[ indexToDisplay ] }</h4> */}
    </div>
  );
};

export default AppoCurData;