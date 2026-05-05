import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import store from "../../../../redux/store.js";
import { appointmentUpdate } from "../../../../redux/put.js";
import { setProp } from "../../../../redux/sync.js";
import { servIdVal } from "../../../../validations/appointment_val.js";
import { errs } from "../../../../errors.js";

const AppoUpdateForm = ({ state, data }) => {
  const dispatch = useDispatch();
  // const sub_servs = useRef( { all: store.getState().sub_services, assigned: store.getState().sub_services[ state.update.currentData. ] } );
  return(
    <div >
      <h3>Sub servicios asignados al turno</h3>
      {

      }
      <h3>Sub servicios para agregar</h3>
      {
        // sub_services.map( ss => < )
      }
    </div>
  );
};

export default AppoUpdateForm;