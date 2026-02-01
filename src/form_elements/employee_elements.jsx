import React from "react";

export const normalInput = ( shouldAdd, key, selected, setSelected, body, text ) => {
  if( shouldAdd ){
    body[ key ] = "";
    setSelected( { ...selected, [ key ]: () => (
      <div key={ key } className="ServUpdate-normalInput">
        <h3>{text}</h3>
        <input onChange={ ( e ) => { body[ key ] = e.target.value; } }/>
      </div>
    ) } );
  }else{
    if( body[ key ] !== undefined ){
      delete body[ key ];
      const remainingKeys = { ...selected };
      delete remainingKeys[ key ];
      setSelected( remainingKeys );
    };
  };
};

export const shiftSelect = ( shouldAdd, key, selected, setSelected, body ) => {
  if( shouldAdd ){
    body[ key ] = "am";
    setSelected( { ...selected, [ key ]: () => (
      <div key={ key }>
        <h3>Turno</h3>
        <select onChange={ ( e ) => { body[ key ] = e.target.value; } }>
          <option value="am">am</option>
          <option value="pm">pm</option>
        </select>
      </div>
    ) } );
  }else{
    if( body[ key ] !== undefined ){
      delete body[ key ];
      const remainingKeys = { ...selected };
      delete remainingKeys[ key ];
      setSelected( remainingKeys );
    };
  };
};