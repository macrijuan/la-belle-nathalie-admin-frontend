import React, { useState, useRef } from "react";
import CheckboxOption from "./checkbox_option/checkbox_option.jsx";

import "./serv_udpate.css";

const ServUpdate = ({ state, setState }) => {
  console.log( "ServUpdate rendered" );

  const [ selected, setSelected ] = useState( {} );

  const data = useRef({
    body: {},
    manageNormalInput: ( shouldAdd, key, body ) => {
      console.log( "shouldAdd:" );
      console.log( shouldAdd );
      if( shouldAdd ){
        setSelected( { ...selected, [ key ]: () => (
          <div key={ key }>
            <label>Nombre:</label>
            <input onChange = { ( e ) => { body[ key ] = e.target.value; } } />
          </div>
        ) } );
      }else{
        delete body[ key ];
        const remainingKeys = { ...selected };
        delete remainingKeys[ key ];
        setSelected( remainingKeys );
      };
    },
    manageShift: ( shouldAdd, key, body ) => {
      if( shouldAdd ){
        
      }else{
          
      };
    }
  });

  if( state.update ) return(
    <div className="ServUpdate-container">
      <div className="ServUpdate">
        <button onClick={() => { setState( { ...state, update: 0 } ); } }>cancelar actualización</button>
        <div>
          <label>Selecciona la información a actualizar</label>
          <div className="ServUpdate-optionBox">
            <CheckboxOption label="Nombre" chekboxChange={data.current.manageNormalInput} selected={ selected } selectedKey="name" body={ data.current.body } />
          </div>
        </div>
        <form className="ServUpdate-FormContainer">
          {
            Object.values( selected ).map( html => html() )
          }
          <button type='submit' onClick={ ( e ) => { e.preventDefault(); console.log( data.current.body ); } }>actualizar</button>
        </form>
      </div>
    </div>
  );
};

export default ServUpdate;