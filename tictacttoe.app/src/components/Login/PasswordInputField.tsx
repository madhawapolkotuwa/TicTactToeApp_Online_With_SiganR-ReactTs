import React from 'react';

interface Props {
    handlePasswordChange: (event:React.ChangeEvent<HTMLInputElement>) => void ;
    passwordValue: string;
    passwordError:string;
    placeholder:string;
}

const PasswordInputField : React.FC<Props> = ({handlePasswordChange,passwordValue,passwordError,placeholder}) => {
  return (
    <>
    <div className='form-group my-3'>
        <input type='password' value={passwordValue} onChange={handlePasswordChange} placeholder={placeholder} 
        className='form-control'/>
        <p className='text-danger'>{passwordError}</p>
    </div>
    </>
  )
}

export default PasswordInputField