import { errs } from "../redux/action_names.js";

export const nameVal = ( name ) => {
  if( name.length < 1 || name.length > 35 ) return errs.length( "nombre", 1, 35 );
};

export const shiftVal = ( shiftTimes ) => {
  if( !( shiftTimes[ 0 ] < shiftTimes[ 1 ] ) ) return errs.timeOrder( "horario de laboral", "de inicio", "de finalización" );
};

export const shiftsVal = ( amShift, pmShift ) => {
  if( amShift[ 1 ] > pmShift[ 0 ] ) return errs.timeOrder( "turnos laborales", "del turno matutino", "del vespertino, en su totalidad" );
};