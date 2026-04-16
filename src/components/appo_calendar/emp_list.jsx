import React, { useState, useEffect } from "react";

const EmpList = ( { services, selServInd, employees, selEmpInd, dateData, toMins, setState } ) => {

  console.log( "EmpList executed." );

  const [ value, setValue ] = useState( 0 );

  useEffect( () => {
    if( selEmpInd === null ) setValue( 0 );
  }, [ selEmpInd ] );


  if( selServInd !== null ){
    console.log( "EmpList has rendered.");
    if( employees.length ){
      const handleEmpApply = ( clickedEmpInd ) => {
        if( !selEmpInd || JSON.stringy( services[ selServInd ][ employees[ clickedEmpInd ].shift ] ) !== JSON.stringy( services[ selServInd ][ employees[ selEmpInd ].shift ] ) ){          
          dateData.empShiftStart = toMins( services[ selServInd ][ employees[ clickedEmpInd ].shift ][ 0 ] );
          dateData.empShiftEnd = toMins( services[ selServInd ][ employees[ clickedEmpInd ].shift ][ 1 ] );
          dateData.shiftDurationInMins = dateData.empShiftEnd - dateData.empShiftStart;
        };
        setState( curState => ( { ...curState, employee: clickedEmpInd } ) );
      };
    
      return(
        <div>
          <p style={{ display:"inline-block", backgroundColor:"rgb( 255, 255, 255, 0.8 )" }}>Lista de profesionales:</p>
           <select className="AppoCalendar-EmployeList" onChange={ e => { setValue( Number( e.target.value ) ); } } value={ value }>
            {
              employees.map( ( e, i ) => (
                <option value={ i } key={ "employees_"+i }>{ e.first_name }  { e.last_name }</option>
              ) )
            }
          </select>
          <button
            onClick={ () => { handleEmpApply( value ); } }
          >aplicar empleado</button>
        </div>
      );
    };

    return(
      <h3>No hay empleados para asignar a un turno.</h3>
    );
  };
};

export default React.memo( EmpList );