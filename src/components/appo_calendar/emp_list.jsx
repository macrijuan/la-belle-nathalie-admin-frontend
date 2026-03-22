import React, { useRef } from "react";
import { useDispatch } from "react-redux";
// import { getServEmps } from "./calendar_state_managers.js";

const EmpList = ( { services, selServInd, employees, dateData, toMins, setState } ) => {

  console.log( "EmpList executed." );

  const dispatch = useDispatch();

  const selectedEmployee = useRef( 0 );

  if( selServInd !== null ){
    if( employees.length ){
      console.log( "EmpList has rendered.");
      const handleEmpClick = ( clickedEmpInd ) => {
        if( services[ selServInd ][ employees[ clickedEmpInd ].shift ] !== services[ selServInd ][ employees[ selEmpInd ].shift ] ){
          dateData.current.empShiftStart = toMins( services[ selServInd ][ employees[ clickedEmpInd ].shift ][ 0 ] );
          dateData.current.empShiftEnd = toMins( services[ selServInd ][ employees[ clickedEmpInd ].shift ][ 1 ] );
        };
        dateData.current.sub_servs = [];
        dateData.current.appoDurationInMins = 0;
        dateData.current.empShiftStart = toMins( services[ selServInd ][ employees[ selEmpInd ].shift ][ 0 ] );
        dateData.current.empShiftEnd = toMins( services[ selServInd ][ employees[ selEmpInd ].shift ][ 1 ] );
        setState( curState => ( { ...curState, employee: selectedEmployee.current } ) );
      };
    
      return(
        <div>
          <p style={{ display:"inline-block", backgroundColor:"rgb( 255, 255, 255, 0.8 )" }}>Lista de profesionales:</p>
           <select className="AppoCalendar-EmployeList" onChange={ e => { selectedEmployee.current = Number( e.target.value ); } } value={ selectedEmployee.current }>
            {
              employees.map( ( e, i ) => (
                <option value={ i } key={ "employees_"+i }>{ e.first_name }  { e.last_name }</option>
              ) )
            }
          </select>
          <button
            onClick={ () => {  } }
          >aplicar empleado</button>
        </div>
      );
    };

    return(
      <h3>No hay empleados para asignar a un turno.</h3>
    );
  };
};

export default  EmpList;