import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { getServs }  from "../../redux/get.js";
import store from "../../redux/store.js";
import { setProp } from "../../redux/sync.js";
import { postAppo } from "../../redux/post.js";
import ServList from "./serv_list.jsx";
import EmpList from "./emp_list.jsx";
import SubServList from "./sub_serv_list.jsx";
import UserList from "./user_list.jsx";
import "./appo_calendar.css";

const months = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];

export const toMins = ( hhmmss ) => {
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
    user: null,
    service: null,
    employee: null,
    users: [],
    employees: [],
    sub_services: [],
    userReq: 0,
    empReq: 0,
    displayCalendar: 0
  } );

  const users = state.users;
  const services = useSelector( state => state.services );
  const employee = state.employee !== null ? state.employees[ state.employee ] :undefined;
  const sub_services = state.sub_services;
  
  const dispatch = useDispatch();
  
  const dateData = useRef( {
    //date data
    stringifyedMonth: state.month > 8 ?`${ state.month+1 }` :`0${ state.month+1 }`,
    monthsFirstWeekDay: ( new Date( Date.UTC( state.year, state.month, 1 ) ) ).getUTCDay(),
    lastMonthsDate: ( new Date( Date.UTC( state.year, state.month+1, 0 ) ) ).getUTCDate(),
    getHsMins: () => {
      const hs = currentDate.current.getUTCHours();
      const mins = currentDate.current.getUTCMinutes();
      return `${hs > 9 ?hs :`0${hs}`}:${mins > 9 ?mins :`0${mins}`}`;
    },
    //appo data
    sub_servs: [],
    formattedAppoDur: "0 Hs, 0 Mins",
    appoDurationInMins: 0,
    //emp data
    shiftDurationInMins: undefined,
    empShiftStart: undefined,
    empShiftEnd: undefined
  } );
  const stringifyedCurrentDate = useRef( `${ state.year }-${ dateData.current.stringifyedMonth }-${ state.day > 9 ?state.day :`0${state.day}` }` );
  
  const days = [];
  
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
      { day, employeeId: employeeId, sub_servs: sub_servs.map( ss => ss.id ), user: state.user.id },
      {
        service:{ id: services[ state.service ].id , name: services[ state.service ].name },
        sub_servs,
        employee:{ id: employee.id, name: employee.name, first_name: employee.first_name, last_name: employee.last_name },
        empInd: state.employee,
        start_time,
        end_time
      }
    ) );
  };

  if( state.displayCalendar ){
    console.log( "FULLFILLS DAYS" );
    if( dateData.current.monthsFirstWeekDay ){
      for( let day = 0; day < dateData.current.monthsFirstWeekDay; day++ ){
        days.push(
          <div className="AppoCalendar-PrevMonthDays" key={ "monthsFirstWeekDay_"+day }></div>
        );
      };
    };

    mainLoop: for( let day = 1; day <= dateData.current.lastMonthsDate; day++ ){
      const currentMapedDay = `${ state.year }-${ dateData.current.stringifyedMonth }-${ day > 9 ?day :`0${day}` }`;
      console.log( currentMapedDay );
      //check if currentMapedDay = Sunday
      if( ( new Date( currentMapedDay ) ).getUTCDay() === 0 ){
        days.push(
          <div className="AppoCalendar-Day" key={ "days_"+day }>
            <p>{ day }</p>
          </div>
        );
        continue mainLoop;
      };
      if( currentMapedDay > stringifyedCurrentDate.current ){
        //CHECK IF FUTURE DAY
        // console.log( "____FUTURE CASE____" );

        if(
          !state.employees[ state.employee ].appointments[ currentMapedDay ]
          || ( toMins( state.employees[ state.employee ].appointments[ currentMapedDay ][ 0 ].start_time ) - dateData.current.empShiftStart ) >= dateData.current.appoDurationInMins
        ){
          // console.log( "FREE DAY OR BETWEEN EMP SHIFT START AND FIRST APPO" );
          dayBoxFiller(
            days, day, services[ state.service ][ employee.shift ][ 0 ], handleAppoPost,
            [ currentMapedDay, employee.id, dateData.current.sub_servs, services[ state.service ][ employee.shift ][ 0 ] ]
          );
          continue mainLoop;
        };

        let i = 0;
        while( i < ( state.employees[ state.employee ].appointments[ currentMapedDay ].length - 1 ) ){
          if(
            (
              toMins( state.employees[ state.employee ].appointments[ currentMapedDay ][ i+1 ].start_time )
              - toMins( state.employees[ state.employee ].appointments[ currentMapedDay ][ i ].end_time )
            ) >= dateData.current.appoDurationInMins
          ){
            // console.log( "BETWEEN APPOINTMENTS" );
          dayBoxFiller(
            days, day, state.employees[ state.employee ].appointments[ currentMapedDay ][ i ].end_time, handleAppoPost,
            [ currentMapedDay, employee.id, dateData.current.sub_servs, state.employees[ state.employee ].appointments[ currentMapedDay ][ i ].end_time ]
          );
          continue mainLoop;
          };
          i++;
        };

        if(
          (
            dateData.current.empShiftEnd
            - toMins( state.employees[ state.employee ].appointments[ currentMapedDay ][ i ].end_time )
          ) >= dateData.current.appoDurationInMins
        ){
          // console.log( "BETWEEN LAST APPOINTMENTS AND EMP SHIFT END TIME" );
          dayBoxFiller(
            days, day, state.employees[ state.employee ].appointments[ currentMapedDay ][ i ].end_time, handleAppoPost,
            [ currentMapedDay, employee.id, dateData.current.sub_servs, state.employees[ state.employee ].appointments[ currentMapedDay ][ i ].end_time ]
          );
          continue mainLoop;
        };

        // console.log( "NOT POSSIBLE" );
        days.push(
          <div className="AppoCalendar-Day" key={ "days_"+day }>
            <p>{ day }</p>
          </div>
        );
        
      }else if( currentMapedDay === stringifyedCurrentDate.current ){
        //CHECK IF TODAY
        // console.log( "____TODAY CASE____" );
        const halfHourToFuture = toMins( dateData.current.getHsMins() ) + 30;
        days.push(
          <div className="AppoCalendar-Day" key={ "days_"+day }>
            <p>{ day }</p>
          </div>
        );
      }else{
        //PAST DAY
        // console.log( "____PAST DAY CASE____" );
        days.push(
          <div className="AppoCalendar-Day" key={ "days_"+day }>
            <p>{ day }</p>
          </div>
        );
      };
    };

  };
  
  console.log( "____AppoCalendar finished execution____");
  return(
    <div className="AppoCalendar">
      <div className="AppoCalendar-header">
        <h1>Calendario de citas</h1>
      </div>

      <Link to="/home" >atrás</Link>

      <UserList users={ state.users } selectedUser={ state.user } dateData= { dateData.current } setState={ setState } />
      <p>Usuario seleccionado: {state.user ?`${state.user.first_name} ${state.user.last_name}` :"Ninguno"} </p>

      <ServList  services={ services } selServInd={ state.service } user={ state.user } dateData={ dateData.current } setState={ setState } />

      <EmpList
        services={ services } selServInd={ state.service }
        employees={ state.employees }
        dateData={ dateData.current } toMins={ toMins } setState={ setState }
      />

      <SubServList selServ={ state.service } services={ services } selEmpInd={ state.employee } employees={ state.employees } dateData={ dateData.current } setState={ setState } />

      {
        state.displayCalendar
          ?<div>
            <h2 className="AppoCalendar-text" >{ months[ state.month ] } de { state.year }</h2>
            <button className="AppoCalendar-SwitchMonth" onClick={ () => { handleMonthChange(); } }>Ver mes
              { state.month === currentDate.current.getUTCMonth() ?" siguiente" :" actual"}
            </button>
            <p className="AppoCalendar-text">El calendario muestra los días y horarios en los que { employee.first_name } está disponible.</p>
            <div className="AppoCalendar-tableHeader">
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
        :null
      }
    </div>
  );
};

export default AppoCalendar;