import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, selectAddUser } from '../redux/features/user'
import '../css/Profile.css'
import Axios from 'axios'
import { login } from '../redux/features/user'
import { Modal, Button, Form } from "react-bootstrap";
import FileUpload from './FileUpload'
import { message } from 'antd'

//PROFILE COMPONENT
const Profile = (props) => {

    const dispatch = useDispatch()

    //GET THE LOGGED IN USER
    const user = useSelector(selectUser)

    //IF NO USER TOKEN REDIRECT TO LOG IN PAGE
    if (!user.token) {
        window.location.href = "/"
    }

    //GET ALL THE USERS ARRAY
    const selectaddUser = useSelector(selectAddUser)

    //GET ONLY THE USER WITH THE ID PROVIDED FROM THE ADMIN PAGE
    const usr = selectaddUser.filter(row =>
        row.id === props.id)

    //MODAL DISPLAY VALUE
    const [show, setShow] = useState(false);

    //ON CHANGE PASSWORD BUTTON CLICK MODAL
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //UPDATE PASSWOWRD INPUT FIELD STATES
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    //PASSWORD ERROR STATES
    const [newPasswordError, setNewPasswordError] = useState("")
    const [notMatchingPasswords, setNotMatchingPasswords] = useState("")

    function setoldpassword(e) {
        setOldPassword(e.target.value)
    }
    function setnewpassword(e) {
        setNewPassword(e.target.value)
    }
    function setconfirmpassword(e) {
        setConfirmPassword(e.target.value)
    }

    function updatePassword() {
        var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/

        if (!passwordRegex.test(newPassword)) {
            setNewPasswordError("Password should contain at least one uppercase letter, number and special character!")

        } else {
            setNewPasswordError("")
        }
        if (newPassword !== confirmPassword) {
            setNotMatchingPasswords("Passwords don't match!")
        } else {
            setNotMatchingPasswords("")
        }

        const data = {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
            id: id
        }

        Axios.post("http://localhost:3001/updatePassword", data, {
            headers: {
                Authorization: user.token
            }
        }).then((result) => {
            if (result.data.status === 200) {
                message.success(result.data.message)
            }
            if (result.data.status === 400) {
                message.error(result.data.message)
            }
        })
    }

    //USER DATA STATES
    const [name, setName] = useState(null)
    const [surname, setSurname] = useState(null)
    const [fatherName, setFatherName] = useState(null)
    const [email, setEmail] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [datelindja, setDatelindja] = useState(null)
    const [username, setUsername] = useState(null)
    const [id, setId] = useState(null)

    //ERRORS STATES
    const [nameError, setNameError] = useState("")
    const [surnameError, setSurnameError] = useState("")
    const [fatherNameError, setFatherNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [phoneNumberError, setPhoneNumberError] = useState("")
    const [birthdayError, setBirthdayError] = useState("")
    const [usernameError, setUsernameError] = useState("")

    useEffect(() => {
        if (!props.id) {
            setName(user.name)
            setSurname(user.surname)
            setFatherName(user.fatherName)
            setEmail(user.email)
            setPhoneNumber(user.phoneNumber)
            setDatelindja(user.birthday)
            setUsername(user.username)
            setId(user.id)
        } else {
            setName(usr[0].emri)
            setSurname(usr[0].mbiemri)
            setFatherName(usr[0].atesia)
            setEmail(usr[0].email)
            setPhoneNumber(usr[0].nr_tel)
            setDatelindja(usr[0].datelindja)
            setUsername(usr[0].username)
            setId(usr[0].id)
        }
    }, [props.id]) //eslint-disable-line react-hooks/exhaustive-deps


    //UPDATE NAME
    function setname(e) {
        setName(e.target.value)
    }

    //UPDATE SURNAME
    function setsurname(e) {
        setSurname(e.target.value)
    }

    //UPDATE FATHER NAME
    function setfathername(e) {
        setFatherName(e.target.value)
    }

    //UPDATE EMAIL
    function setemail(e) {
        setEmail(e.target.value)
    }

    //UPDATE PHONE NUMBER
    function setphonenumber(e) {
        setPhoneNumber(e.target.value)
    }

    //UPDATE DATELINDJA
    function setdatelindja(e) {
        setDatelindja(e.target.value)
    }

    //UPDATE USERNAME
    function setusername(e) {
        setUsername(e.target.value)
    }

    //UPDATE USER BUTTON ON CLICK EVENT
    function updateUser() {

        //REGEX VALIDATORS
        var onlyLettersRegex = /^[a-zA-Z]+$/;
        var onlyNumbersRegex = /^[0-9]+$/;
        var emailRegex = /^([a-zA-Z0-9_\\.]+)@([a-zA-Z0-9_\\.]+)\.([a-zA-Z]{2,5})$/

        //NAME VALIDATOR
        if (!onlyLettersRegex.test(name)) {
            setNameError("Name should contain only letters!")
        } else {
            setNameError("")
        }

        //USERNAME VALIDATOR
        if (!onlyLettersRegex.test(username)) {
            setUsernameError("Username should contain only letters!")
        } else {
            setUsernameError("")
        }

        //SURNAME VALIDATOR
        if (!onlyLettersRegex.test(surname)) {
            setSurnameError("Surname should contain only letters!")
        } else {
            setSurnameError("")
        }

        //FATHER NAME VALIDATOR
        if (!onlyLettersRegex.test(fatherName)) {
            setFatherNameError("Father's name should contain only letters!")
        } else {
            setFatherNameError("")
        }

        //PHONE NUMBER VALIDATOR
        if (!onlyNumbersRegex.test(phoneNumber)) {
            setPhoneNumberError("Phone number should contain only numbers!")
        } else {
            setPhoneNumberError("")
        }

        //EMAIL VALIDATOR
        if (!emailRegex.test(email)) {
            setEmailError("The email format you entered is wrong!")
        } else {
            setEmailError("")
        }

        //DATELINDJA VALIDATOR
        if (datelindja === "") {
            setBirthdayError("Birthday should't be empty!")
        } else {
            setBirthdayError("")
        }

        //SEND THE POST REQUEST TO NODEJS API

        //data to be sent to the nodejs api
        const data = {
            id: id,
            name: name,
            surname: surname,
            fatherName: fatherName,
            email: email,
            phoneNumber: phoneNumber,
            datelindja: datelindja,
            username: username
        }

        Axios.post("http://localhost:3001/updateProfile", data, {
            headers: {
                Authorization: user.token
            }
        }).then((result) => {
            if (result.data.status === 200) {
                if (id === user.id) {
                    dispatch(login({
                        id: result.data.user.id,
                        name: result.data.user.name,
                        surname: result.data.user.surname,
                        fatherName: result.data.user.fatherName,
                        email: result.data.user.email,
                        phoneNumber: result.data.user.phoneNumber,
                        birthday: result.data.user.datelindja,
                        username: result.data.user.username,
                        role: user.role,
                        avatar: user.avatar,
                        token: result.data.user.token
                    }))
                }
                message.success(result.data.message)
            }
            if (result.data.status === 400) {
                message.error(result.data.message)
            }
        })
    }

    return (
        <div>

            <div className="card py-5">
                <div className="mt-3 px-4">
                    <div className="d-flex flex-row align-items-center mt-2">
                        <FileUpload id={props.id} />
                        <div className='changepass_div'><button className='btn' onClick={handleShow} >Change Password</button></div>
                        <Modal
                            show={show}
                            onHide={handleClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Change Password</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group className="mb-3" controlId="oldPassword">
                                        <Form.Label>Old Password</Form.Label>
                                        <Form.Control onChange={(e) => setoldpassword(e)} type="password" placeholder="" />
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control onChange={(e) => setnewpassword(e)} type="password" placeholder="" />
                                        <div className='errors'>{newPasswordError}</div>
                                        <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control onChange={(e) => setconfirmpassword(e)} type="password" placeholder="" />
                                        <div className='errors'>{notMatchingPasswords}</div>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>Close</Button>
                                <Button variant="primary" onClick={updatePassword}>Update</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                <div className="inputs px-4"> <span className="text-uppercase">Name</span> <input onChange={(e) => setname(e)} type="text" value={name} className="form-control"></input>
                    <div className='errors'>{nameError}</div>
                </div>
                <div className="row mt-3 g-2">
                    <div className="col-md-6">
                        <div className="inputs px-4"> <span className="text-uppercase">Surname</span> <input onChange={(e) => setsurname(e)} type="text" value={surname} className="form-control"></input>
                            <div className='errors'>{surnameError}</div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="inputs px-4"> <span className="text-uppercase">Father's Name</span> <input onChange={(e) => setfathername(e)} value={fatherName} type="text" className="form-control"></input>
                            <div className='errors'>{fatherNameError}</div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3 g-2">
                    <div className="col-md-6">
                        <div className="inputs px-4"> <span className="text-uppercase">Email</span> <input type="text" onChange={(e) => setemail(e)} value={email} className="form-control"></input>
                            <div className='errors'>{emailError}</div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="inputs px-4"> <span className="text-uppercase">Phone Number</span> <input type="text" onChange={(e) => setphonenumber(e)} value={phoneNumber} className="form-control"></input>
                            <div className='errors'>{phoneNumberError}</div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3 g-2">
                    <div className="col-md-6">
                        <div className="inputs px-4"> <span className="text-uppercase">Datelindja</span> <input onChange={(e) => setdatelindja(e)} value={datelindja} type="date" className="form-control"></input>
                            <div className='errors'>{birthdayError}</div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="inputs px-4"> <span className="text-uppercase">Username</span> <input onChange={(e) => setusername(e)} value={username} type="text" className="form-control"></input>
                            <div className='errors'>{usernameError}</div>
                        </div>
                    </div>
                    <div className='button-div'>
                        <button onClick={updateUser} className='btn'>Update</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Profile;
