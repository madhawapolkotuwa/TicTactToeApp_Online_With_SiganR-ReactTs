import React, { useContext, useEffect, useState } from 'react'
import PasswordInputField from './PasswordInputField'
import { useNavigate } from 'react-router-dom';
import { GlobleContext } from '../../context/Context';

const Login: React.FC<{register?:boolean}> = ({register = false}) => {

    const { userDispatch } = useContext(GlobleContext);

    const [usernameInput, setUsernameInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<{password:string; confirmPassword:string}>({
        password:'',
        confirmPassword:''
    });

    const [usernameError, setUsenameError] = useState<string>("Enter username");
    const [passwordError, setPasswordError] = useState<string>("Enter Password");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("Enter password again");

    const navigate = useNavigate();


    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        const username = event.target.value.trim();
        setUsernameInput(event.target.value);
        if(username.length > 3){
            setUsenameError("");
        }else{
            setUsenameError("Username must contain at least 4 characters");
        }
    }

    const handlePasswordChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const passwordInputValue = event.target.value.trim();
        const passwordInputFieldName = event.target.placeholder;
        const newPasswordInput = {...passwordInput, [passwordInputFieldName]:passwordInputValue};
        setPasswordInput(newPasswordInput);

        if(passwordInputFieldName === 'password'){
            const uppercaseRegExp = /(?=.*?[A-Z])/;
            const lowercaseRegExp = /(?=.*?[a-z])/;
            const digitsRegExp = /(?=.*?[0-9])/;
            const specialCharRegExp = /(?=.*?[<,>,!,#,%,~,_,+,=,@,*])/;
            const minLengthRegExp = /.{8,}/;

            const passwordLength = passwordInputValue.length;
            const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
            const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
            const digitsPassword = digitsRegExp.test(passwordInputValue);
            const specialCharPassword = specialCharRegExp.test(passwordInputValue);
            const minLengthPassword = minLengthRegExp.test(passwordInputValue);

            let errorMsg = "";
            if(passwordLength === 0){
                errorMsg = "password is empty";
            }else if(!uppercasePassword){
                errorMsg = "At least one Uppercase Character";
            }else if(!lowercasePassword){
                errorMsg = "At least one lowercase Character";
            } else if (!digitsPassword) {
                errorMsg = "At least one digit";
            } else if (!specialCharPassword) {
                errorMsg = "At least one Special Characters";
            } else if (!minLengthPassword) {
                errorMsg = "At least minumum 8 characters";
            } else {
                errorMsg = "";
            }

            setPasswordError(errorMsg);

        }

        if(passwordInputFieldName === 'confirmPassword' || (passwordInputFieldName === "password" && passwordInput.confirmPassword.length > 0)){
            if(passwordInputValue !== passwordInput.password){
                setConfirmPasswordError("Confirm password is not matched");
            }else{
                setConfirmPasswordError("");
            }
        }
    }

    const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(passwordError || confirmPasswordError || usernameError) return;
        if(register){
            fetchRegister();
        }else{
            fetchLogin();
        }
    }

    const fetchLogin = async () => {
        try {
            const result = await fetch(process.env.REACT_APP_API_URL +"api/User/login",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    username: usernameInput,
                    password: passwordInput.password
                })
            }).then(res => res.json());
            if(result.accessToken){
                localStorage.setItem('jwtToken', result.accessToken);
                localStorage.setItem('refreshToken',result.refreshToken);
                userDispatch({type:'LOGIN',payload:{username:usernameInput, accessToken:result.accessToken, refreshToken:result.refreshToken}})
                alert("Login success!!");
                navigate("/");
            }
            // alert(result.message);
        } catch (error) {
            alert(error);
        }
    }

    const fetchRegister = async () => {
        try {
            const result = await fetch(process.env.REACT_APP_API_URL+"api/User/register",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    username: usernameInput,
                    password: passwordInput.password
                })
            }).then(res => res.json());
            alert(result.message);
            navigate("/login");
        } catch (error) {
            alert(error);
        }
    }

    useEffect(()=>{
        if(!register){
            setConfirmPasswordError("");
        }else{
            setConfirmPasswordError("Enter password again")
        }
    },[register])

    return (
        <div className='container'>
            <div className='row'>
                <div className='d-flex flex-row justify-content-around align-items-center'>
                    <div>
                        <h2 className='text-center text-dark mt-1'>{register ? 'Register Form' : 'Login Form'}</h2>
                        <div className='text-center mb-1 text-dark'>Tic Tact Toe</div>
                    </div>
                    <div className='card my-2 p-1' style={{minWidth:'25rem'}}>
                        <form className='card-body p-lg-2' onSubmit={(e)=> handleSubmit(e)}>
                            <div className='text-center'>
                                <img src="https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295397__340.png" alt="Userimage" width="200px" className="img-fluid profile-image-pic img-thumbnail rounded-circle my-1" />
                            </div>
                            <div className='mb-3'>
                                <input type='text' placeholder='username' className='form-control' id='username'
                                value={usernameInput}
                                onChange={(event) => handleUsername(event)}
                                />
                                <p className='text-danger'>{usernameError}</p>
                            </div>
                            <div>
                                {/* <input type="password" placeholder='password' className='form-control' id='password'/> */}
                                <PasswordInputField handlePasswordChange={handlePasswordChange} 
                                passwordValue={passwordInput.password} 
                                passwordError={passwordError} 
                                placeholder='password'/>
                            </div>
                            {
                                register ? <div>
                                    <PasswordInputField handlePasswordChange={handlePasswordChange} 
                                    passwordValue={passwordInput.confirmPassword} 
                                    passwordError={confirmPasswordError} 
                                    placeholder='confirmPassword'/> 
                                </div> : null
                            }
                            <div className='text-center mt-2'>
                                <button type='submit' className='btn btn-primary' style={{minWidth:'8rem'}}>{register ? 'Register': 'Login'}</button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login