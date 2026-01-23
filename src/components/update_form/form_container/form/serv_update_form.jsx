import React from "react";
import { useDispatch } from "react-redux";
import { serviceUpdate } from "../../../../redux/put.js";
import { setProp } from "../../../../redux/sync.js";
import { nameVal, shiftVal, shiftsVal } from "../../../../validations/service_val.js";

const ServUpdateForm = ({ selected, state, data }) => {
  const dispatch = useDispatch();
  return(
    ( selected.name || selected.am || selected.mp )
      ?<form className="ServUpdate-form" onSubmit={ ( e ) => {
          e.preventDefault();
          dispatch( setProp( "loader", 1 ) );
          let errors = {};
          if( data.current.body.name ){
            const name = nameVal( data.current.body.name );
            if( name ) errors = { ...name };
          };
          if( data.current.body.am ){
            const shift = shiftVal( data.current.body.am );
            if( shift ) errors = { ...errors, ...shift };
          };
          if( data.current.body.pm ){
            const shift = shiftVal( data.current.body.pm );
            if( shift ) errors = { ...errors, ...shift };
            if( data.current.body.am ){
              const shifts = shiftsVal( data.current.body.am, data.current.body.pm );
              if( shifts ) errors = { ...errors, ...shifts };
            }
          };
          if( Object.keys( errors ).length ){
            dispatch( setProp( "message", errors ) );
            dispatch( setProp( "loader", 0 ) );
          }else dispatch( serviceUpdate( state.update.inds, { ids: state.update.currentData.map( s => ( s.id ) ), update: data.current.body } ) );
        } }>
        {
          Object.values( selected ).map( html => html() )
        }
        <button type='submit'>actualizar</button>
      </form>
    :null
  );
};

export default ServUpdateForm;