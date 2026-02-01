import React from "react";
import AppoBoard from "./appo_board.jsx";
import ServBoard from "./serv_board.jsx";
import EmpBoard from "./emp_board.jsx";

const BoardSelector = ({ selectedBoard }) => {
  console.log( "BoardSelector" );
  switch( selectedBoard ){
    case "appo": return <AppoBoard />;
    case "serv": return <ServBoard />;
    case "emp": return <EmpBoard />;
    default: return (
      <div className="BoardSelector">
        <h1>NINGÚN TABLERO SELECCIONADO POR "BoardSelector". Si el error persiste contactese con el equipo de software (job.email.jami@gmail.com).</h1>
      </div>
    );
  };
};

export default BoardSelector;