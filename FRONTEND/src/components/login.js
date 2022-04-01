import React, { useState } from "react";
import '../css/LogIn.css'
import "react-bootstrap";
import Axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { login } from '../redux/features/user'
import { message } from 'antd'

//LOG IN COMPONENT
function LogIn() {

    const dispatch = useDispatch()
    const [loginError, setLoginError] = useState("")

    //DECLARE EMAIL AND PASSWORD USING USESTATE HOOKS
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    //FUNCTION TO UPDATE THE PASSWORD EVERYTIME USER INPUTS DATA INTO PASSWORD FIELD
    function setpassword(event) {
        setPassword(event.target.value)
    }

    //FUNCTION TO UPDATE THE EMAIL EVERYTIME USER INPUTS DATA INTO PASSWORD FIELD
    function setemail(event) {
        setEmail(event.target.value)
    }

    //DATA TO BE SENT WITH AXIOS POST REQ
    const data = {
        email: email,
        password: password,
    }

    //LOG IN ON BUTTON CLICK FUNCTION
    function log_in(e) {
        e.preventDefault();
        //SEND A POST REQUEST AT THE API
        Axios.post("http://localhost:3001/login", data).then(function (res) {

            if (res.data.status === 400) {
                setLoginError(res.data.message)
            } else {
                setLoginError("")
            }

            //IF RESPONSE STATUS == 200 UPDATE USER DATA AND REDIRECT TO MAIN PAGE
            if (res.data.status === 200) {
                dispatch(login({
                    id: res.data.user.id,
                    name: res.data.user.name,
                    surname: res.data.user.surname,
                    fatherName: res.data.user.fatherName,
                    email: res.data.user.email,
                    phoneNumber: res.data.user.phoneNumber,
                    birthday: res.data.user.birthday,
                    username: res.data.user.username,
                    role: res.data.user.role,
                    avatar: res.data.user.avatar,
                    token: res.data.user.token
                }))

                window.location.href = '/home'
            } else {
                message.error(res.data.message)
            }
        })
    }

    return (
        <div className="login_box container">
            <div className="input-group flex-column">
                <div className="login-icon">
                    <FontAwesomeIcon className="icon-user" icon={faUser} />
                </div>
                <div className="email-input-div" style={{ marginTop: 40, color: "red" }}>
                    {loginError}
                </div>
                <div className="email-input-div flex-column">
                    <input onChange={setemail} className="input-field" type="email" placeholder="Enter Email"></input>
                </div>
                <div className="password-input-div flex-column">
                    <input onChange={setpassword} className="input-field" type="password" placeholder="Enter password"></input>
                </div>
                <div className="submit-button">
                    <input type="button" className="login-button" onClick={(e) => log_in(e)} value="Log In"></input>
                </div>
                <div className="create_account_div">
                    <h5 className="create_account_text">You don't have an account? <a className="signUp_link" href="/signUp">Sign Up</a></h5>
                </div>
            </div>
        </div>
    )
}

export default LogIn;
