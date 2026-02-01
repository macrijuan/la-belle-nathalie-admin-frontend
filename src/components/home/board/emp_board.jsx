import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errs } from "../../../redux/action_names.js";
import store from "../../../redux/store.js";
import { setProp } from "../../../redux/sync.js";
import { getEmps } from "../../../redux/get.js";
import { empDel } from "../../../redux/delete.js";
import Alert from "../../alert/alert.jsx";
import EmpUpdate from "../../update_form/emp_update.jsx";
import "./emp_board.css";

const EmpBoard = () => {
  const user = useSelector( state => state.user );
  const emps = useSelector( state => state.employees );
  const dispatch = useDispatch();

  useEffect( () => {
    if( user.email && !store.getState().empReq ){
      dispatch( setProp( "loader", 1 ) );
      dispatch( getEmps() );
    };
  }, [ user ] );

  const toDelete = useRef( { ids: new Set(), inds:new Set() } );
  const [ state, setState ] = useState( { multipleDeletion: 0, update: null, selectedToDel: [], post: 0  } );

  const handleMultipleDeletionList = ( id, ind, identity ) => {
    if( toDelete.current.inds.has( ind ) ){
      const indToDel = state.selectedToDel.findIndex( empIdentity => empIdentity === identity );
      if( indToDel !== -1 ){
        toDelete.current.ids.delete( id );
        toDelete.current.inds.delete( ind );
        const remainingNames = [ ...state.selectedToDel ];
        remainingNames.splice( indToDel, 1 );
        setState( { ...state, selectedToDel: remainingNames } );
      }else{
        console.log( "Index to delete not found." );
        dispatch( setProp( "message", errs.unknown ) );
      };
    }else{
      toDelete.current.ids.add( id );
      toDelete.current.inds.add( ind );
      setState( { ...state, selectedToDel: [ ...state.selectedToDel, identity ] } );
    };
  };

  const handleDelete = async ( id, ind ) => {
    dispatch( setProp( "loader", 1 ) );
    let deleted = undefined;
    if( state.selectedToDel.length ){
      deleted = await dispatch( empDel( [ ...toDelete.current.ids ], [ ...toDelete.current.inds ] ) );
    }else{
      console.log( "FALLSE HERE" );
      deleted = await dispatch( empDel( [ id ], [ ind ] ) );
    };
    if( deleted ){
      toDelete.current.ids.clear();
      toDelete.current.inds.clear();
      setState( { ...state, multipleDeletion: 0, selectedToDel: [] } );
    };
  };

  const handleUpdateList = ( currentToAdd, ind ) => {
    if( !state.update ){
      setState( { ...state, update: { currentData: [ currentToAdd ], inds: [ ind ], ids: [ currentToAdd.id ] } } );
    }else{
      setState( { ...state, update: {
        currentData: [ ...state.update.currentData, currentToAdd ],
        inds: [ ...state.update.inds, ind ],
        ids: [ ...state.update.ids, currentToAdd.id ]
      } } );
    };
  };

  const handleCancelMultDel = () => {
    toDelete.current.ids.clear();
    toDelete.current.inds.clear();
    setState( { ...state, multipleDeletion: 0, selectedToDel: [] } );
  };

  return(
    <div className="Home-board">
      <Alert accept={ () => { ; } } cancel={ () => { ; } } />
      <EmpUpdate state={ state } setState={ setState } />
      {
        state.multipleDeletion
          ?<div className="ServBoard-selectedToDelete">
            <button onClick={ () => { handleCancelMultDel(); } }>cancelar eliminación multiple</button>
            <label>Empleados a eliminar:</label>
            <div className="AppoRowData-ss">
              { state.selectedToDel.join( ", " ) }
            </div>
            <button onClick={ () => { handleDelete( [ ...toDelete.current.ids ], [ ...toDelete.current.inds ] ); } }>eliminación multiple</button>
          </div>
        :<button className="ServBoard-multipleDeletion" onClick={ () => { setState( { ...state, multipleDeletion: 1 } ); } }>activar eliminación multiple</button>
      }
      <div className="EmpBoard-row" style={{ backgroundColor: "rgb( 239, 239, 239 )" }}>
        <h4>Nombre</h4>
        <h4>Apellido</h4>
        <h4>Turno</h4>
        <h4>Identificación</h4>
      </div>
      {
        ( emps && emps.length )
          ?emps.map( ( e, i ) => {
            return(
              <div key={ e.id } className="EmpBoard-row" style={{ backgroundColor: i%2 !== 0 ?"rgb( 239, 239, 239 )" :"rgb( 253, 172, 238 )" }}>
                <div className="Home-row-buttons">
                  <button onClick={ () => { handleUpdateList( e, i ); } }>actualizar</button>
                  <button onClick={ () => { if( state.multipleDeletion ) handleMultipleDeletionList( e.id, i, e.identity ); else handleDelete( e.id, i ); } }>eliminar</button>
                </div>
                <h4>{ e.first_name }</h4>
                <h4>{ e.last_name }</h4>
                <h4>{ e.shift }</h4>
                <h4>{ e.identity }</h4>
              </div>
            );
          } )
        :null
      }
    </div>
  );
};

export default EmpBoard;