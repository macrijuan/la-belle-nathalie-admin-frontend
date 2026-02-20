import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { appoCalReq, getServEmps }  from "../../redux/get.js";
import store from "../../redux/store.js";
import { setProp } from "../../redux/sync.js";
import { postAppo, userSignIn } from "../../redux/post.js";
import SubServList from "./sub_serv_list.jsx";
import UserList from "./user_list.jsx";
import "./appo_calendar.css";

const months = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];

const toMins = ( hhmmss ) => {
  const data = hhmmss.split( ":" );
  return Number( data[ 0 ] ) * 60 + Number( data[ 1 ] );
};
const toHs = ( mins ) => {
  const hh = mins / 60;
  const mm = mins % 60
  return `${ hh > 9 ?Math.floor( hh ) : `0${Math.floor( hh )}` }:${ mm > 9 ?mm :`0${mm}` }:00`;
};

const dayBoxFiller = ( days, day, stringTime, postFunc, postFuncArgs ) => {
  days.push(
    <div className="AppoCalendar-Day" key={ "days_"+day } onClick={ () => { console.log("SUBMITED!"); postFunc( ...postFuncArgs ) } }>
      <p>{ day }</p>
      <p>{ stringTime }</p>
    </div>
  );
};

const AppoCalendar = () => {
  console.log( "AppoCalendar rendered" );
  const currentDate = useRef( ( () => {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth()+1;
    const day = date.getUTCDate();
    let hh = date.getUTCHours();
    const formatedHH = hh - 3;
    if( formatedHH < 0 ) hh = 24 + formatedHH;
    else hh = formatedHH;
    const mins = date.getUTCMinutes();
    const stringedDate = `${year}-${month > 9 ?month :`0${month}`}-${day > 9 ?day :`0${day}`}T${hh > 9 ?hh :`0${hh}`}:${mins > 9 ?mins :`0${mins}`}:00.000Z`;
    return new Date( stringedDate );
  } )() );

  const [ state, setState ] = useState( {
    //USE THIS INFO TO COMPARE WITH THE APPOINTMENTS OF THE SELECTED EMPLOYEE
    year: currentDate.current.getUTCFullYear(),
    month: currentDate.current.getUTCMonth(), //WARNING: 0 index based
    day: currentDate.current.getUTCDate(),
    service: 0,
    employee: 0,
    displayCalendar: 0,
    displayApplyBtn: 0,
    displayUserList: 0
  } );

  const employees = useSelector( state => state.employees );
  const employee = employees[ state.employee ];
  const services = useSelector( state => state.services );
  const users = useSelector( state => state.users );
  
  const dispatch = useDispatch();
  
  useEffect( () => {
    console.log( "useEffect executed" );
    const { servReq, empReq, userReq } = store.getState();
    if( !servReq || !empReq || !userReq ){
      dispatch( setProp( "loader", 1 ) );
      dispatch( appoCalReq() );
    };
  }, [] );
  
  const dateData = useRef( {
    //date data
    stringifyedMonth:state.month > 8 ?`${ state.month+1 }` :`0${ state.month+1 }`,
    monthsFirstWeekDay:( new Date( Date.UTC( state.year, state.month, 1 ) ) ).getUTCDay(),
    lastMonthsDate:( new Date( Date.UTC( state.year, state.month+1, 0 ) ) ).getUTCDate(),
    getHsMins:() => {
      const hs = currentDate.current.getUTCHours();
      const mins = currentDate.current.getUTCMinutes();
      return `${hs > 9 ?hs :`0${hs}`}:${mins > 9 ?mins :`0${mins}`}`;
    },
    //appo data
    sub_servs:[],
    user: null,
    formattedAppoDur:0,
    appoDurationInMins:0,
    //emp data
    // empShiftStart:toMins( services[ state.service ][ employee.shift ][ 0 ] ),
    // empShiftEnd:toMins( services[ state.service ][ employee.shift ][ 1 ] )
  } );
  const stringifyedCurrentDate = useRef( `${ state.year }-${ dateData.current.stringifyedMonth }-${ state.day > 9 ?state.day :`0${state.day}` }` );
  
  const days = [];

  const handleServiceChange = ( servInd ) => {
    dispatch( setProp( "loader", 1 ) );
    dateData.current.sub_servs = [];
    dateData.current.appoDurationInMins = 0;
    dateData.current.empShiftStart = toMins( services[ state.service ][ employee.shift ][ 0 ] );
    dateData.current.empShiftEnd = toMins( services[ state.service ][ employee.shift ][ 1 ] );
    dispatch( getServEmps( services[ servInd ].id ) );
    setState( { ...state, service:servInd, employee:0, displayCalendar:0, displayApplyBtn:0,  } );
  };

  const handleEmpChange = ( empInd ) => {
    if( services[ state.service ][ employees[ empInd ].shift ] !== services[ state.service][ employee.shift ] ){
      dateData.current.empShiftStart = toMins( services[ state.service ][ employees[ empInd ].shift ][ 0 ] );
      dateData.current.empShiftEnd = toMins( services[ state.service ][ employees[ empInd ].shift ][ 1 ] );
    };
    setState( {...state, employee:empInd } );
  };
  
  const handleMonthChange = () => {
    if( state.month === currentDate.current.getUTCMonth() ){
      if( state.month !== 11 ){
        const nextMonth = state.month + 1;
        dateData.current.stringifyedMonth = nextMonth > 8 ?( nextMonth+1 ).toString() :`0${state.month}`;
        dateData.current.monthsFirstWeekDay = ( new Date( state.year, nextMonth, 1 ) ).getUTCDay();
        dateData.current.lastMonthsDate = ( new Date( state.year, nextMonth+1, 0 ) ).getUTCDate();
        setState( { ...state, month: nextMonth } );
      }else{
        const nextYear = state.year + 1;
        dateData.current.stringifyedMonth = "01";
        dateData.current.monthsFirstWeekDay = ( new Date( nextYear, 0, 1 ) ).getUTCDay();
        dateData.current.lastMonthsDate = 31;
        setState( { ...state, year: nextYear, month: 0 } );
      };
    }else{
      if( state.month !== 0 ){
        const prevMonth = state.month - 1;
        dateData.current.stringifyedMonth = prevMonth > 9 ?state.month.toString() :`0${state.month}`;
        dateData.current.monthsFirstWeekDay = ( new Date( state.year, prevMonth, 1 ) ).getUTCDay();
        dateData.current.lastMonthsDate = ( new Date( state.year, state.month, 0 ) ).getUTCDate();
        setState( { ...state, month: prevMonth } );
      }else{
        const prevYear = state.year - 1;
        dateData.current.stringifyedMonth = "12";
        dateData.current.monthsFirstWeekDay = ( new Date( prevYear, 11, 1 ) ).getUTCDay();
        dateData.current.lastMonthsDate = 31;
        setState( { ...state, year: prevYear, month: 11 } );
      };
    };
  };

  const handleAppoPost = ( day, employeeId, sub_servs, start_time ) => {
    dispatch( setProp( "loader", 1 ) );
    const end_time = toHs( toMins( start_time ) + dateData.current.appoDurationInMins );
    console.log( { day, employeeId: employeeId, sub_servs} );
    console.log( "Submited!" );
    dispatch( setProp( "loader", 0 ) );
    dispatch( postAppo(
      { day, employeeId: employeeId, sub_servs:sub_servs.map( ss => ss.id ), user: dateData.current.user.id },
      {
        service:{ id: services[ state.service ].id , name:services[ state.service ].name },
        sub_servs,
        employee:{ id:employee.id, name:employee.name, first_name:employee.first_name, last_name:employee.last_name },
        empInd:state.employee,
        start_time,
        end_time
      }
    ) );
  };
  if( !services.length || !employee || !users.length ) return(
    <div className="AppoCalendar-error">
      <Link to="/home">volver</Link>
    </div>
  );
  else{//IMPLEMENT HERE THE LOGIC --> && !days.length
    if( !dateData.current.empShiftStart ){
      dateData.current.empShiftStart = toMins( services[ state.service ][ employee.shift ][ 0 ] );
      dateData.current.empShiftEnd = toMins( services[ state.service ][ employee.shift ][ 1 ] );
    };
    if( dateData.current.sub_servs.length && !state.displayApplyBtn ){
      if( dateData.current.monthsFirstWeekDay ){
        for( let day = 0; day < dateData.current.monthsFirstWeekDay; day++ ){
          days.push(
            <div className="AppoCalendar-PrevMonthDays" key={ "monthsFirstWeekDay_"+day }></div>
          );
        };
      };
      const halfHourToFuture = toMins( dateData.current.getHsMins() ) + 30;
      mainLoop: for( let day = 1; day <= dateData.current.lastMonthsDate; day++ ){
        const currentMapedDay = `${ state.year }-${ dateData.current.stringifyedMonth }-${ day > 9 ?day :`0${day}` }`;
        // console.log( currentMapedDay );
        //check if currentMapedDay = Sunday
        if( ( new Date( currentMapedDay ) ).getUTCDay() === 0 ){
          console.log( currentMapedDay );
          days.push(
            <div className="AppoCalendar-Day" key={ "days_"+day }>
              <p>{ day }</p>
            </div>
          );
          continue mainLoop;
        };
        if( currentMapedDay > stringifyedCurrentDate.current ){
          //CHECK IF FUTURE DAY
          // console.log( "____FUTURE DAY____" );
          if( !employee.appointments[ currentMapedDay ] ){
            //Between employee's shift start and shift end
            // console.log( "NO APPOS." );
            dayBoxFiller(
              days, day, services[ state.service ][ employee.shift ][ 0 ], handleAppoPost,
              [ currentMapedDay, employee.id, dateData.current.sub_servs, services[ state.service ][ employee.shift ][ 0 ] ]
            );
            continue mainLoop;
          }else if(
            //Between employee's shift start and first appointment
            ( toMins( employee.appointments[ currentMapedDay ][ 0 ].start_time ) - dateData.current.empShiftStart ) >= dateData.current.appoDurationInMins
          ){
            // console.log( "EMP SHIFT START - FIRST APPO" );
            dayBoxFiller(
              days, day, employee.appointments[ currentMapedDay ][ 0 ].start_time, handleAppoPost,
              [ currentMapedDay, employee.id, dateData.current.sub_servs, employee.appointments[ currentMapedDay ][ 0 ].start_time ]
            );
            continue mainLoop;
          }else{
            let i = 0;
            while( ( i < employee.appointments[ currentMapedDay ].length - 1 ) ){
              if(
                ( toMins( employee.appointments[ currentMapedDay ][ i + 1 ].start_time ) - toMins( employee.appointments[ currentMapedDay ][ i ].end_time ) ) >= dateData.current.appoDurationInMins
              ){
                //Between current appointment and next appointment.
                // console.log( "CUR APPO - NEXT APPO" );
                dayBoxFiller(
                  days, day, employee.appointments[ currentMapedDay ][ i ].end_time, handleAppoPost,
                  [ currentMapedDay, employee.id, dateData.current.sub_servs, employee.appointments[ currentMapedDay ][ i ].end_time ]
                );
                continue mainLoop;
              };
              i++;
            };
            if(
              ( ( dateData.current.empShiftEnd - toMins( employee.appointments[ currentMapedDay ][ i ].end_time ) ) >= dateData.current.appoDurationInMins )
            ){
              //between last appointment and employee's end shift time
              console.log( "LAST APPO - EMP SHIFT END" );
              dayBoxFiller(
                days, day, employee.appointments[ currentMapedDay ][ i ].end_time, handleAppoPost,
                [ currentMapedDay, employee.id, dateData.current.sub_servs, employee.appointments[ currentMapedDay ][ i ].end_time ]
              );
            }else{
              //not possible
              // console.log( "LAST APPO - EMP SHIFT END -> NOT POSSIBLE" );
              days.push(
                <div className="AppoCalendar-Day" key={ "days_"+day }>
                  <p>{ day }</p>
                </div>
              );
            };
          };
        }else if( currentMapedDay === stringifyedCurrentDate.current ){
          //CHECK IF TODAY
          // console.log( "____TODAY CASE____" );
          const firstAppoST = employee.appointments[ currentMapedDay ]
            ?toMins( employee.appointments[ currentMapedDay ][ 0 ].start_time )
          :0;
          const lastAppoET = employee.appointments[ currentMapedDay ]
            ?toMins( employee.appointments[ currentMapedDay ][ employee.appointments[ currentMapedDay ].length - 1 ].end_time )
          :0;
          if( !employee.appointments[ currentMapedDay ] ){
            // console.log( "NO APPOS." );
            switch( true ){
              case ( halfHourToFuture <= dateData.current.empShiftStart ):
                //Between employee's shift start and shift end
                // console.log( "EMP SHIFT START - EMP SHIFT END");
                dayBoxFiller(
                  days, day, services[ state.service ][ employee.shift ][ 0 ], handleAppoPost,
                  [ currentMapedDay, employee.id, dateData.current.sub_servs, services[ state.service ][ employee.shift ][ 0 ] ]
                );
                break;
              case (
                halfHourToFuture < dateData.current.empShiftEnd
                && ( ( dateData.current.empShiftEnd - halfHourToFuture ) >= dateData.current.appoDurationInMins )
              ):
                //between 30 mins to future and employee's shift end
                // console.log( "30 MINS TO FUTURE - EMP SHIFT END");
                dayBoxFiller(
                  days, day, toHs( halfHourToFuture ), handleAppoPost,
                  [ currentMapedDay, employee.id, dateData.current.sub_servs, toHs( halfHourToFuture ) ]
                );
                break;
                default: 
                //not possible
                // console.log( "30 MINS TO FUTURE - EMP SHIFT END -> NOT POSSIBLE");
              days.push(
                <div className="AppoCalendar-Day" key={ "days_"+day }>
                  <p>{ day }</p>
                </div>
              );
            };
            continue mainLoop;
          }else if( halfHourToFuture <= dateData.current.empShiftStart && ( firstAppoST - dateData.current.empShiftStart ) >= dateData.current.appoDurationInMins ){
            //Between employee's shift start and first appointment
            // console.log( "EMP SHIFT START - FIRST APPO" );
            dayBoxFiller(
              days, day, employee.appointments[ currentMapedDay ][ 0 ].start_time, handleAppoPost,
              [ currentMapedDay, employee.id, dateData.current.sub_servs, employee.appointments[ currentMapedDay ][ 0 ].start_time ]
            );
            continue mainLoop;
          }else if( halfHourToFuture > dateData.current.empShiftStart && ( firstAppoST - halfHourToFuture ) >= dateData.current.appoDurationInMins ){
            //Between 30 mins to future and first appointment
            // console.log( "30 MINS TO FUTURE - FIRST APPO" );
            dayBoxFiller(
              days, day, toHs( halfHourToFuture ), handleAppoPost,
              [ currentMapedDay, employee.id, dateData.current.sub_servs, toHs( halfHourToFuture ) ]
            );
            continue mainLoop;
          }else{
            let i = 0;
            while( ( i < employee.appointments[ currentMapedDay ].length - 1 ) ){
              if(
                halfHourToFuture >= toMins( employee.appointments[ currentMapedDay ][ i ].end_time )
                && halfHourToFuture < toMins( employee.appointments[ currentMapedDay ][ i + 1 ].start_time )
                && ( toMins( employee.appointments[ currentMapedDay ][ i + 1 ].start_time ) - halfHourToFuture ) >= dateData.current.appoDurationInMins
              ){
                //Between 30 mins to future and and next appointment
                // console.log( "__AMONG APPOS__" );
                // console.log( "30 MINS TO FUTURE - NEXT APPO" );
                dayBoxFiller(
                  days, day, toHs( halfHourToFuture ), handleAppoPost,
                  [ currentMapedDay, employee.id, dateData.current.sub_servs, toHs( halfHourToFuture ) ]
                );
                continue mainLoop;
              }else if(
                halfHourToFuture < toMins( employee.appointments[ currentMapedDay ][ i ].end_time )
                && (toMins( employee.appointments[ currentMapedDay ][ i + 1 ].start_time ) - toMins( employee.appointments[ currentMapedDay ][ i ].end_time )) >= dateData.current.appoDurationInMins
              ){
                //Between current appointment and next appointment.
                // console.log( "__AMONG APPOS__" );
                // console.log( "CUR APPO - NEXT APPO" );
                dayBoxFiller(
                  days, day, employee.appointments[ currentMapedDay ][ i ].end_time, handleAppoPost,
                  [ currentMapedDay, employee.id, dateData.current.sub_servs, employee.appointments[ currentMapedDay ][ i ].end_time ]
                );
                continue mainLoop;
              };
              i++;
            };
            // console.log( "AMONG APPOS NOT FOUND. PASSES TO LAST CASES." );
            if(
              halfHourToFuture <= lastAppoET
              && ( ( dateData.current.empShiftEnd - lastAppoET ) >= dateData.current.appoDurationInMins )
            ){
              //between last appointment and employee's end shift time
              // console.log( "LAST APPO - EMP SHIFT END" );
              days.push(
                <div
                  className="AppoCalendar-Day" key={ "days_"+day }
                  onClick={ () => { handleAppoPost( currentMapedDay, employee.id, dateData.current.sub_servs, employee.appointments[ currentMapedDay ][ i ].end_time ); } }
                >
                  <p>{ day }</p>
                  <p>{ employee.appointments[ currentMapedDay ][ i ].end_time }</p>
                </div>
              );
            }else if(
              halfHourToFuture > lastAppoET
              && ( dateData.current.empShiftEnd - halfHourToFuture ) >= dateData.current.appoDurationInMins
            ){
              //between 30 mins to future and employee's end shift time
              // console.log( "30 MINS TO FUTURE - EMP SHIFT END" );
              days.push(
                <div
                className="AppoCalendar-Day" key={ "days_"+day }
                onClick={ () => { handleAppoPost( currentMapedDay, employee.id, dateData.current.sub_servs, toHs( halfHourToFuture ) ) } }
                >
                  <p>{ day }</p>
                  <p>{ toHs( halfHourToFuture ) }</p>
                </div>
              );
            }else{
              //not possible
              // console.log( "30 MINS TO FUTURE - EMP SHIFT END -> NOT POSSIBLE" );
              days.push(
                <div className="AppoCalendar-Day" key={ "days_"+day }>
                  <p>{ day }</p>
                </div>
              );
            };
          };
        }else{
          //past day
          // console.log( "PAST DAY -> NOT POSSIBLE" );
          days.push(
            <div className="AppoCalendar-Day" key={ "days_"+day }>
              <p>{ day }</p>
            </div>
          );
        };
      };
    };

    return(
      <div className="AppoCalendar">
        <UserList shouldDisplay = { state.displayUserList } dateData = { dateData.current } />
        <div className="AppoCalendar-topElements">
          <div className="header">
            <Link to="/home" >Atrás</Link>
            <h1>Calendario de citas de { employee.name }</h1>
          </div>
          <div>
            <p style={{ display:"inline-block", backgroundColor:"rgb( 255, 255, 255, 0.8 )" }}>Lista de servicios:</p>
            <select className="AppoCalendar-EmployeList" onChange={ ( e ) => { handleServiceChange( Number( e.target.value ) ); } } value={ state.service } >
              {
                services.map( ( s, i ) => (
                  <option value={ i } key={ "services_" + i }>{ s.name }</option>
                ))
              }
            </select>
            <SubServList state={ state } setState={ setState } dateData={ dateData } shiftDuration={ dateData.current.empShiftEnd - dateData.current.empShiftStart }/>
            <p style={{ display:"inline-block", backgroundColor:"rgb( 255, 255, 255, 0.8 )" }}>Lista de profesionales:</p>
            <select className="AppoCalendar-EmployeList" onChange={ e => { handleEmpChange( Number( e.target.value ) ); } } value={ state.employee }>
              {
                employees.map( ( e, i ) => (
                  <option value={ i } key={ "employees_"+i }>{ e.first_name }  { e.last_name }</option>
                ) )
              }
            </select>
          </div>
        </div>
        { state.displayCalendar
            ?state.displayApplyBtn
            ?<button onClick={ () => { setState( { ...state, displayApplyBtn:0 } ); } }>Aplicar sub servicios</button>
            :<div>
                <h2 className="AppoCalendar-text" >{ months[ state.month ] } de { state.year }</h2>
                <button className="AppoCalendar-SwitchMonth" onClick={ () => { handleMonthChange(); } }>Ver mes
                  { state.month === currentDate.current.getUTCMonth() ?" siguiente" :" actual"}
                </button>
                <p className="AppoCalendar-text">El calendario muestra los días y horarios en los que { employee.first_name } está disponible.</p>
                <div className="AppoCalendar-header">
                  <p>Domingo</p>
                  <p>Lunes</p>
                  <p>Martes</p>
                  <p>Miercoles</p>
                  <p>Jueves</p>
                  <p>Viernes</p>
                  <p>Sabado</p>
                </div>
                { days }
              </div>
          :<h3>Debe seleccionar al menos un sub servicio.</h3>
        }
      </div>
    );
  };
};

export default AppoCalendar;