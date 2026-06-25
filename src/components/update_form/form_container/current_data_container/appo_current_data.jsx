import React, { useState } from "react";

const AppoCurData = ({ state }) => {

  console.log( state.update.currentData );

  return(
    <div className="ServUpdate-current">
      <h2>Información actual</h2>
      <h4>Día: { state.update.currentData.day }</h4>
      <h4>Hora de inicio: { state.update.currentData.start_time }</h4>
      <h4>Hora de finalización: { state.update.currentData.end_time }</h4>
      <h4>Sub servicios asignados: { state.update.currentData.sub_services.map( ss => ss.name ).join( ", " ) }</h4>
    </div>
  );

};

export default AppoCurData;