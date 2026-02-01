import React from "react";
import { useDispatch } from "react-redux";
import { employeeUpdate } from "../../../../redux/put.js";
import { setProp } from "../../../../redux/sync.js";
import { nameVal, idenVal, shiftVal } from "../../../../validations/employee_val.js";

const EmpUpdateForm = ({ selected, state, data }) => {
  const dispatch = useDispatch();
  return(
    ( selected.first_name || selected.last_name || selected.identity || selected.shift  )
    ?<form className="ServUpdate-form" onSubmit={ ( e ) => {
          e.preventDefault();
          let errors = {};
          if( data.current.body.first_name !== undefined ){
            const first_name = nameVal( data.current.body.first_name, "nombre" );
            if( first_name ) errors = { ...first_name };
            else data.current.body.first_name = data.current.body.first_name.toUpperCase();
          };
          if( data.current.body.last_name !== undefined ){
            const last_name = nameVal( data.current.body.last_name, "apellido" );
            if( last_name ) errors = { ...errors, ...last_name };
            else data.current.body.last_name = data.current.body.last_name.toUpperCase();
          };
          if( data.current.body.shift !== undefined ){
            const shift = shiftVal( data.current.body.shift );
            if( shift ) errors = { ...errors, ...shift };
          };
          if( data.current.body.identity !== undefined ){
            const identity = idenVal( data.current.body.identity );
            if( identity ) errors = { ...errors, ...identity };
            else data.current.body.identity = Number( data.current.body.identity );
          };
          if( Object.keys( errors ).length ){
            dispatch( setProp( "message", errors ) );
            dispatch( setProp( "loader", 0 ) );
          }else{
            // console.log( { ids: state.update.ids, update: data.current.body } );
            // console.log( "Update data submited" );
            // dispatch( setProp( "loader", 0 ) );
            dispatch( setProp( "loader", 1 ) );
            dispatch( employeeUpdate( state.update.inds, { ids: state.update.ids, update: data.current.body } ) );
          };
        } }>
        {
          Object.values( selected ).map( html => html() )
        }
        <button type='submit'>actualizar</button>
      </form>
    :null
  );
};

export default EmpUpdateForm;