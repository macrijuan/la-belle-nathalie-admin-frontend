import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setProp, setProp2 } from "../../redux/sync.js";
import store from "../../redux/store.js";
import { actions, actioner, config } from "../../redux/action_names.js";
import { errs } from "../../errors.js";
import "./sub_serv_list.css";

const SubServList = ( { selServ, services, selEmpInd, employees, dateData, setState } ) => {

  const dispatch = useDispatch();
  const [ selected, setSelected ] = useState( [] );

  if( selEmpInd !== null ){
    const handleSelect = ( ss ) => {
      const match = selected.findIndex( inc_sub_serv => inc_sub_serv.id === ss.id );
      if( match === -1 ){
        const sum = dateData.appoDurationInMins + Number( ss.mins );
        if( sum > dateData.shiftDurationInMins ) dispatch( setProp( "message", { "duración":"No es posible agregar este sub servicio porque la duración del turno sería mayor que el tiempo de trabajo del empleado." } ) );
        else{
          dateData.appoDurationInMins = sum;
          setSelected( [ ...selected, ss ] );
        };
      }else{
        const remaining = [ ...selected ];
        remaining.splice( match, 1 );
        dateData.appoDurationInMins -= Number( ss.mins );
        dateData.sub_servs = remaining;
        setSelected( remaining );
      };
      if( dateData.appoDurationInMins !== 0 ) dateData.formattedAppoDur = `${Math.floor( dateData.appoDurationInMins / 60 )} Hs, ${dateData.appoDurationInMins % 60} Mins`;
      else dateData.formattedAppoDur = `0 Hs, 0 Mins`;
    };

    const handleApply = async () => {
      dateData.sub_servs = selected;
      if( selected.length ){
        try{
          dispatch( setProp( "loader", 1 ) );
          const token = store.getState().user.token;
          const res = await fetch( `${process.env.SERVER}/appointment/get_all_appos/${ employees[ selEmpInd ].id }`, config( token, 'GET' ) );
          if( res ){
            const body = await res.json();
            if( !body.errors ){
              const appos = {};
              body.forEach( a => {
                if( appos[ a.day ] ){
                  let indexToAssign = 0;
                  findIndex: while( indexToAssign < appos[ a.day ].length ){
                    if( a.start_time < appos[ a.day ][ indexToAssign ].start_time ){
                      appos[ a.day ].splice( indexToAssign, 0, { start_time: a.start_time, end_time: a.end_time } );
                      break findIndex;
                    }else indexToAssign++;
                  };
                  if( indexToAssign === appos[ a.day ].length ) appos[ a.day ].push( { start_time: a.start_time, end_time: a.end_time } );
                }else{
                  appos[ a.day ] = [ { start_time: a.start_time, end_time: a.end_time } ];
                };
              } );
  
              const employeeInd = employees.findIndex( e => e.id == body[ 0 ].employeeId );
              const empsWithApposInSelEmp = [ ...employees ];
              empsWithApposInSelEmp[ employeeInd ].appointments = appos;
  
              setState( curState => ( { ...curState, employees: empsWithApposInSelEmp, displayCalendar: 1 } ) );

              dispatch( setProp( "loader", 0 ) );
            }else{
              dispatch( setProp2( { loader: 0, message: body.errors } ) );
            };
            
          }else{
            dispatch( setProp2( { loader: 0, message: errs.conn } ) );
          };
        }catch( err ){
          console.error( err );
          dispatch( setProp2( { loader: 0, message: errs.unknown } ) );
        };
      }else{
        setState( curState => ( { ...curState, displayCalendar: 0 } ) );
      };
    };

    const handleClear = () => {
      dateData.sub_servs = [];
      dateData.formattedAppoDur = "0 Hs, 0 Mins";
      dateData.appoDurationInMins = 0;
      setSelected( [] );
    };
  
    if( services.length ) return(
      <div className="SubServList-container">
        <h4>Sub servicios:</h4>
        <p className="SubServList-container-p">Duración aproximada del turno: {dateData.formattedAppoDur}</p>
        <p className="SubServList-container-p">Duración aproximada del turno (en minutos): { dateData.appoDurationInMins }</p>
        <p className="SubServList-container-p">Minutos de trabajo del empleado: { dateData.shiftDurationInMins }</p>
        <button className="SubServList-container-clear" onClick={ () => { handleClear(); } }>deseleccionar todos</button>
        <div className="SubServList">
          {
            services[ selServ ].sub_services.map( ( ss, ssi ) => (
              <div
              className={ selected.find( _ss => _ss.id === ss.id ) ?"clicked" :"item" }
              value={ ss.name }
              key={ ssi }
              onClick={ () => { handleSelect( ss ); } }
              >
                <p>{ ss.name }</p>
              </div>
            ) )
          }
        </div>
        <button className="SubServList-container-apply" onClick={ () => { handleApply(); } }>aplicar sub servicios</button>
      </div>
    );
    return(
      <h3>No hay sub servicios para asignar a un turno.</h3>
    );
  };
};

export default React.memo( SubServList );