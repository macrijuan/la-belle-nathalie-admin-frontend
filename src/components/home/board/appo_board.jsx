import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProp } from "../../../redux/sync.js";
import { getAppos } from "../../../redux/get.js";
import { appoDel } from "../../../redux/delete.js";
import "./appo_board.css";

const AppoBoard = () => {
  const appos = useSelector( state => state.appos );
  const dispatch = useDispatch();

  const handleCancel = ( id, appoInd ) => {
    dispatch( setProp( "loader", 1 ) );
    dispatch( appoDel( id, appoInd ) );
  };

  return(
    <div className="Home-board">
      <div className="AppoBoard-row" style={{ backgroundColor: "rgb( 239, 239, 239 )" }}>
        <h4>Día</h4>
        <h4>Hora de inicio</h4>
        <h4>Hora de finalizado</h4>
        <h4>Servicio</h4>
        <h4>Personal</h4>
      </div>
      {
        ( appos && appos.length )
          ?appos.map( ( a, i ) => {
            return(
              <div key={i} className="AppoBoard-row" style={{ backgroundColor: i%2 !== 0 ?"rgb( 239, 239, 239 )" :"rgb( 253, 172, 238 )" }}>
                <div className="AppRowData-cancel">
                  <button onClick={ () => { handleCancel( a.id, i ); } }>cancelar</button>
                </div>
                <h4>{ a.day }</h4>
                <h4>{ a.start_time }</h4>
                <h4>{ a.end_time }</h4>
                <h4>{ a.service.name }</h4>
                <h4>{ a.employee.first_name } { a.employee.last_name }</h4>
                <p className="AppoRowData-ss">Sub servicios: { a.sub_services.map( ( ss ) => ss.name ).join( "," ) }</p>
              </div>
            );
          } )
        :null
      }
    </div>
  );
};

export default AppoBoard;