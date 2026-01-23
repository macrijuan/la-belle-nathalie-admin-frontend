import React from "react";
import "./checkbox_option.css";

const CheckboxOption = ({ label, selectedKey, chekboxChange, selected, setSelected, body, event }) => {
  return(
    <div className="CheckboxOption" key={ selectedKey }>
      <label>
        {label}:
      </label>
      <input
        type='checkbox'
        checked={ selected[ selectedKey ] !== undefined }
        onChange={ ( e ) => { chekboxChange( e.target.checked, selectedKey, selected, setSelected, body, label, event ); } }
      />
    </div>
  );
};

export default CheckboxOption;