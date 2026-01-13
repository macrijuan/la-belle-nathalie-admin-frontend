import React from "react";
import "./checkbox_option.css";

const CheckboxOption = ({ label, chekboxChange, selected, selectedKey, body }) => {
  return(
    <div className="CheckboxOption" key={ selectedKey }>
      <label>
        {label}:
      </label>
      <input type='checkbox' checked={ selected[ selectedKey ] !== undefined } onChange={ ( e ) => { chekboxChange( e.target.checked, selectedKey, body ); } }  />
    </div>
  );
};

export default CheckboxOption;