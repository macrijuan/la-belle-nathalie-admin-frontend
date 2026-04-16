import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { handleServApply } from "./calendar_state_managers.js";

const ServList = ( { services, selServInd, user, dateData, setState } ) => {

  console.log( "ServList executed" );

  const [ value, setValue ] = useState( 0 );

  console.log( selServInd );
  useEffect( () => {
    if( selServInd === null ) setValue( 0 );
  }, [ selServInd ] );
  
  const dispatch = useDispatch();

  if( user ){
    console.log( "ServList has rendered" );
    
    if( services.length ){

      return(
        <div>
          <p style={{ display:"inline-block", backgroundColor:"rgb( 255, 255, 255, 0.8 )" }} >Lista de servicios:</p>
          <select className="AppoCalendar-EmployeList" value={ value } onChange={ e => { setValue( Number( e.target.value ) ); } }>
            {
              services.map( ( s, i ) => (
                <option value={ i } key={ s.id }>{ s.name }</option>
              ))
            }
          </select>
          <button
            onClick={ () => { handleServApply( value, services[ value ]?.id, dateData, setState, dispatch ); } }
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