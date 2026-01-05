import React, { useState, useRef } from "react";
import SignUpRequest from "./sign_up_request.jsx";
import SignUp from "./sign_up.jsx";

const SignUpIndex = () => {
  const [ step, setStep ] = useState( 1 );
  const email = useRef( "" );
  if( step === 1 ) return <SignUpRequest setStep={ setStep } email={ email } />;
  else return <SignUp email={ email } />;
};

export default SignUpIndex;