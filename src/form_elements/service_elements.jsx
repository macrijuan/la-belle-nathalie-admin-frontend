import React from "react";
import Select from "../controled_html/select.jsx";

export const normalInput = ( shouldAdd, key, selected, setSelected, body ) => {
  console.log( "normalInput executed" );
  if( shouldAdd ){
    setSelected( { ...selected, [ key ]: () => (
      <div key={ key } className="ServUpdate-normalInput">
        <label>Nombre:</label>
        <input onChange = { ( e ) => { if( e.target.value.length < 36 ) body[ key ] = e.target.value; } } />
      </div>
    ) } );
  }else{
    delete body[ key ];
    const remainingKeys = { ...selected };
    delete remainingKeys[ key ];
    setSelected( remainingKeys );
  };
};

const options = ( times ) => {
  const opts = []
  for( let o = times[ 0 ]; o < times[ 1 ]; o++ ){
    if( o > 9 ) opts.push( `${o}` );
    else opts.push( `0${o}` );
  };
  return opts;
};

const options2 = ( times ) => {
  const opts = []
  for( let o = times[ 0 ]+1; o < times[ 1 ]+1; o++ ){
    if( o > 9 ) opts.push( `${o}` );
    else opts.push( `0${o}` );
  };
  return opts;
};

export const betweenTimes = ( shouldAdd, key, selected, setSelected, body, label, event ) => {
  console.log( "betweenTimes executed" );
  if( shouldAdd ){
    const times = key === "am" ?[ 8, 15 ] :[ 15, 21 ];
    const times1 = times[ 0 ]+1;
    body[ key ] = [ `${( times[ 0 ] > 9 ?times[ 0 ] :`0${times[ 0 ]}` )}:00`, `${( times1 > 9 ?times1 :`0${times1}` )}:00` ];
    setSelected( { ...selected, [ key ]: () => (
      <div key={ key } className="ServUpdate-betweenTimes">
        <label>{label}:</label>
        <div>
          <p>Hora de inicio:</p>
          <p>Hora:</p>
          <Select
            options={ options( times ) }
            handleChange={ ( e, setValue ) => { event( 0, "hh", e.target.value, key, setValue ); } }
          />
          <p>Minuto:</p>
          <Select
            options={ [ "00", "10", "20", "30", "40", "50" ] }
            handleChange={ ( e, setValue ) => { event( 0, "mm", e.target.value, key, setValue ); } }
          />
        </div>
        <div>
          <p>Hora de finalización:</p>
          <p>Hora</p>
          <Select
            options={ options2( times ) }
            handleChange = { ( e, setValue ) => { event( 1, "hh", e.target.value, key, setValue ); } }
          />
          <p>Minuto:</p>
          <Select
            options={ [ "00", "10", "20", "30", "40", "50" ] }
            handleChange={ ( e, setValue ) => { event( 1, "mm", e.target.value, key, setValue ); } }
          />
        </div>
      </div>
    ) } );
  }else{
    delete body[ key ];
    const remainingKeys = { ...selected };
    delete remainingKeys[ key ];
    setSelected( remainingKeys );
  };
};