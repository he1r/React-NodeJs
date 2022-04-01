import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, } from '@fortawesome/free-solid-svg-icons'
import '../css/LogIn.css'
import Axios from 'axios'
import { message } from 'antd'

//SIGN UP COMPONENT
function SignUp(props) {

    //STATES FOR EACH INPUT FIELD
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [fatherName, setFatherName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [birthday, setBirthday] = useState("")
    const [password, setPassword] = useState("")

    //ERRORS STATES
    const [nameError, setNameError] = useState("")
    const [surnameError, setSurnameError] = useState("")
    const [fatherNameError, setFatherNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [phoneNumberError, setPhoneNumberError] = useState("")
    const [birthdayError, setBirthdayError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    //DATA TO BE SENT AT THE AXIOS POST REQUEST
    const data = {
        name: name,
        surname: surname,
        fatherName: fatherName,
        email: email,
        phoneNumber: phoneNumber,
        birthday: birthday,
        password: password
    }

    //ON SIGN UP BUTTON CLICK
    function signUp() {
        //REGEX VALIDATORS
        var onlyLettersRegex = /^[a-zA-Z]+$/;
        var onlyNumbersRegex = /^[0-9]+$/;
        var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
        var emailRegex = /^([a-zA-Z0-9_\\.]+)@([a-zA-Z0-9_\\.]+)\.([a-zA-Z]{2,5})$/

        //VALIDATE EACH VARIABLE
        if (!onlyLettersRegex.test(name)) {
            setNameError("Name should contain only letters!")
        } else {
            setNameError("")
        }
        if (!onlyLettersRegex.test(surname)) {
            setSurnameError("Surname should contain only letters!")
        } else {
            setSurnameError("")
        }
        if (!onlyLettersRegex.test(fatherName)) {
            setFatherNameError("Father's name should contain only letters!")
        } else {
            setFatherNameError("")
        }
        if (!onlyNumbersRegex.test(phoneNumber)) {
            setPhoneNumberError("Phone number should contain only numbers!")
        } else {
            setPhoneNumberError("")
        }
        if (!emailRegex.test(email)) {
            setEmailError("The email format you entered is wrong!")
        } else {
            setEmailError("")
        }
        if (!passwordRegex.test(password)) {
            setPasswordError("Password should contain at least one uppercase letter, number and special character!")

        } else {
            setPasswordError("")
        }
        if (birthday === "") {
            setBirthdayError("Birthday should't be empty!")
        } else {
            setBirthdayError("")
        }

        //SEND A POST REQUEST TO THE API
        Axios.post("http://localhost:3001/signUp", data).then((res) => {
            //IF THE RES = 200 ALERT AND SEND USER TO LOG IN PAGE
            if (res.data.status === 200) {
                if (!props.isAdmin) {
                    window.location.href = "/"
                } else {
                    message.success("User Created")
                }
            } else if (res.data.status === 400) {
                message.error(res.data.message)
            }
        })
    }
    return (
        <div className="login_box container">
            <div className="input-group flex-column">

                <div className="login-icon">
                    <FontAwesomeIcon className="icon-user" icon={faUserPlus} />
                </div>

                <div className="email-input-div flex-column" style={{ marginTop: 40 }}>
                    <input className="input-field" onChange={(e) => { setName(e.target.value) }} type="text" placeholder="Enter Name"></input>
                    <div className='errors'>{nameError}</div>
                </div>

                <div className="email-input-div flex-column">
                    <input className="input-field" onChange={(e) => { setSurname(e.target.value) }} type="text" placeholder="Enter Surname"></input>
                    <div className='errors'>{surnameError}</div>
                </div>

                <div className="email-input-div flex-column">
                    <input className="input-field" onChange={(e) => { setFatherName(e.target.value) }} type="text" placeholder="Enter Father's Name"></input>
                    <div className='errors'>
                        {fatherNameError}
                    </div>
                </div>

                <div className="email-input-div flex-column">
                    <input className="input-field" onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder="Enter Email"></input>
                    <div className='errors'>{emailError}</div>
                </div>

                <div className="email-input-div flex-column">
                    <input className="input-field" onChange={(e) => { setPhoneNumber(e.target.value) }} type="text" placeholder="Enter Phone Number"></input>
                    <div className='errors'>{phoneNumberError}</div>
                </div>

                <div className="email-input-div flex-column">
                    <input className="input-field" onChange={(e) => { setBirthday(e.target.value) }} type="date" placeholder="Enter Birthday"></input>
                    <div className='errors'>{birthdayError}</div>
                </div>

                <div className="password-input-div flex-column">
                    <input className="input-field" onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder="Enter password"></input>
                    <div className='errors'>{passwordError}</div>
                </div>

                <div className="submit-button">
                    <input type="button" onClick={signUp} className="login-button" value="Sign Up"></input>
                </div>
                <div className="create_account_div">
                    {!props.isAdmin && <h5 className="create_account_text">Already have an account? <a className="signUp_link" href="/">Log In</a></h5>}
                </div>
            </div>
        </div>
    )
}

export default SignUp