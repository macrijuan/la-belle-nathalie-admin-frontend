import React, { useState } from "react";

const ServCurData = ({ state }) => {

  const [ indexToDisplay, setIndexToDisplay ] = useState( 0 );

  return(
    <div className="ServUpdate-current">
      <label>Lista de filas seleccionadas:</label>
      <select onChange={ e => { setIndexToDisplay( e.target.value ); } }>
        {
          state.update.currentData.map( ( o, i ) => ( <option value={ i } key={ i }>{ o.name }</option> ) )
        }
      </select>
      <h2>Información actual de "{ state.update.currentData[ indexToDisplay ].name }"</h2>
      <h4>Nombre: { state.update.currentData[ indexToDisplay ].name }</h4>
      <h4>Turno mañana: { state.update.currentData[ indexToDisplay ].am ?`De ${state.update.currentData[ indexToDisplay ].am[ 0 ]} a ${state.update.currentData[ indexToDisplay ].am[ 1 ]}` :"no disponible" }</h4>
      <h4>Turno tarde: { state.update.currentData[ indexToDisplay ].pm ?`De ${state.update.currentData[ indexToDisplay ].pm[ 0 ]} a ${state.update.currentData[ indexToDisplay ].pm[ 1 ]}` :"no disponible" }</h4>
    </div>
  );
};

export default ServCurData;