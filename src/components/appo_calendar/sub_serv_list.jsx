import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProp } from "../../redux/sync";
import "./sub_serv_list.css";

const SubServList = ( { state, setState, dateData, shiftDuration } ) => {

  const dispatch = useDispatch();
  const [ flag, reRender ] = useState( true );

  const services = useSelector( state => state.services );

  const handleClick = (ss) => {
    const match = dateData.current.sub_servs.findIndex( inc_sub_serv => inc_sub_serv.id === ss.id );
    if( match === -1 ){
      const sum = dateData.current.appoDurationInMins + parseInt( ss.mins );
      if( sum > shiftDuration ) dispatch( setProp( "message", { "duración":"No es posible agregar este sub servicio porque la duración del turno sería mayor que el tiempo de trabajo del empleado." } ) );
      else{
        dateData.current.sub_servs.push( ss );
        dateData.current.appoDurationInMins = sum;
        dateData.current.formattedAppoDur = `${Math.floor( dateData.current.appoDurationInMins / 60 )}Hs ${dateData.current.appoDurationInMins % 60} Mins`;
      };
    }else{
      dateData.current.sub_servs.splice( match, 1 );
      dateData.current.appoDurationInMins -= parseInt( ss.mins );
      dateData.current.formattedAppoDur =`${Math.floor( dateData.current.appoDurationInMins / 60 )} Hs, ${dateData.current.appoDurationInMins % 60} Mins`;
    };
    if( !dateData.current.sub_servs.length ) setState( { ...state, displayCalendar:0, displayApplyBtn:0 } );
    else setState( { ...state, displayCalendar:1, displayApplyBtn:1 } );
    reRender( !flag );
  };

  return(
    <div>
      <div className="SubServList">
        {/* <div className="rounded-shadow"> */}
          <h4>Sub servicios:</h4>
          {
            services[ state.service ].sub_services.map( ( ss, ssi ) => (
              <div
                className={ dateData.current.sub_servs.find( _ss => _ss.id === ss.id ) ?"clicked" :"item" }
                value={ ss.name }
                key={ ssi }
                onClick={ () => { handleClick(ss) } }
              >
                <p>{ ss.name }</p>
              </div>
            ) )
          }
        {/* </div> */}
      </div>
      <div className="SubServList-mins">
        <label>Minutos de trabajo del empleado:</label>
        <p>{ shiftDuration }</p>
        <br></br>
        <label>Minutos de tu cita:</label>
        <p>{ dateData.current.appoDurationInMins }</p>
      </div>
    </div>
  );
};

export default SubServList;