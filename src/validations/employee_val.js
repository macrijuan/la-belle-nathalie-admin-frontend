import { errs, errObj } from "../errors.js";

export const nameVal = ( name, text ) => {
  if ( typeof name !== 'string' ) return errs.unknown;
  const normalized = name.normalize( 'NFC' );
  if ( normalized.length < 1 || normalized.length > 35 ) return errObj( text, errs.strict_length( text, 1, 35 ) );
  if ( !( /^\p{L}+(?:\s\p{L}+)*$/u ).test( normalized ) )  return errObj( text, errs.strict_char_type( text, 'letras y espacios (no consecutivos)' ) );
};

export const idenVal = ( iden ) => {
  if( typeof iden !== 'string') return errs.unknown;
  if( !(/\d/).test( iden ) ) return errObj( "identidad", errs.strict_char_type( "identidad", "números" ) );
  if( iden < 4000000 || iden > 100000000 ) return errObj( "identidad", errs.strict_size( "identidad", '4.000.000', '100.000.000' ) );
};

export const shiftVal = ( shift ) => {
  if( typeof shift !== 'string' ) return errs.unknown;
  if( !( shift === 'am' || shift === 'pm' ) ) return errObj( "turno", errs.not_valid( "turno" ) );
};

export const postEmpVal = ( body ) => {
  const first_name = nameVal( body.first_name, "nombre" );
  if( first_name ) return first_name;

  const last_name = nameVal( body.last_name, "apellido" );
  if( last_name ) return last_name;

  const identity = idenVal( body.identity );
  if( identity ) return identity;

  const shift = shiftVal( body.shift );
  if( shift ) return shift;
};