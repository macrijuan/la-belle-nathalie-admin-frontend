import React, { useState } from "react";

const Select = ({ options, handleChange }) => {

  const [ value, setValue ] = useState( options[ 0 ] );

  return(
    <select value={ value } onChange={ e => { handleChange( e, setValue ); } }>
      { options.map( ( opt, i ) => ( <option value={ opt } key={ i }>{ opt }</option> ) ) }
    </select>
  );
};

export default Select;