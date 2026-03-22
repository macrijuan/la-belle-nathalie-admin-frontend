import React, { useEffect, useRef } from "react";
import store from "../../redux/store";
import { useDispatch } from "react-redux";
import { handleServApply } from "./calendar_state_managers.js";

const ServList = ( { services, user, setState } ) => {

  console.log( "ServList re-executed" );
  
  const dispatch = useDispatch();

  const selServInd = useRef( 0 );

  if( user ){
    console.log( "ServList has rendered" );
    
    if( services.length ){
      return(
        <div>
          <p style={{ display:"inline-block", backgroundColor:"rgb( 255, 255, 255, 0.8 )" }} >Lista de servicios:</p>
          <select className="AppoCalendar-EmployeList" onChange={ ( e ) => { selectedService.current =  Number( e.target.value ); } } value = { selServInd.current } >
            {
              services.map( ( s, i ) => (
                <option value={ i } key={ s.id }>{ s.name }</option>
              ))
            }
          </select>
          <button
            onClick={ () => { handleServApply( selServInd.current, services[ selServInd.current ]?.id, setState, dispatch ); } }
          >aplicar servicio</button>
        </div>    
      );
    };

    return(
      <h3>No hay servicios para asignar a un turno.</h3>
    );
  };
};

export default React.memo( ServList );