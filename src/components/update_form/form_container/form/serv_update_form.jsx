import React from "react";
import { useDispatch } from "react-redux";
import { serviceUpdate } from "../../../../redux/put.js";
import { setProp } from "../../../../redux/sync.js";

const ServUpdateForm = ({ selected, state, data }) => {
  const dispatch = useDispatch();
  return(
    ( selected.name || selected.am || selected.mp )
      ?<form className="ServUpdate-form" onSubmit={ ( e ) => {
          e.preventDefault();
          dispatch( setProp( "loader", 1 ) );
          dispatch( serviceUpdate( state.update.inds, { ids: state.update.currentData.map( s => ( s.id ) ), update: data.current.body } ) );
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