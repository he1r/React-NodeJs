const express = require('express')
const config = require('./config.json')
const mysql = require('mysql')
const cors = require("cors")
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const jwt = require('jsonwebtoken')

//CONNECT TO THE DATABASE
const db = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
})

//CREATE THE APP WITH EXPRESS
const app = express();

//FORMAT THE REQUEST DATA 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
app.use(fileUpload())

//DELETE USER REQUEST
app.post("/deleteUser", (req, res) => {
    const token = req.headers.authorization

    try {
        var decoded = jwt.verify(token, config.jwt_secret)
        const id = req.body.id
        const role = req.body.role

        if (role === "admin") {
            res.send({ message: "You cannot delete an admin!", status: 400 })
            return
        }
        else {
            let deleteUserQuery = "DELETE FROM users WHERE id = ?"
            db.query(deleteUserQuery, [id], (err, result) => {
                res.send({ message: "User Deleted!", status: 200 })
                return
            })
        }

    } catch (error) {
        res.send({ message: error, status: 400 })

    }
})

app.post("/companies", (req, res) => {
    var companiesQuery = "SELECT * FROM company"
    try {
        db.query(companiesQuery, (err, result) => {
            const rs = JSON.parse(JSON.stringify(result))
            console.log(rs)
            res.send(rs)
        })
    } catch (error) {
        console.log(error)
    }
})

//GET REQUEST TO GET ALL THE USERS
app.get("/users", (req, res) => {
    const token = req.headers.authorization
    try {
        var decoded = jwt.verify(token, config.jwt_secret)
        const page = req.query.page - 1
        const countPerPage = req.query.countPerPage
        const search = req.query.search
        const select2 = req.query.select2

        let startCount = page * countPerPage;
        let endCount = page * countPerPage + countPerPage

        var select2Query = ""

        if (select2 != "") {
            select2Query = `AND email = '${select2}'`
        }

        var searchQuery = ""

        if (search != "") {
            searchQuery = `AND (id LIKE '%${search}%' OR emri LIKE '%${search}%' OR mbiemri LIKE '%${search}%' OR atesia LIKE '%${search}%' OR email LIKE '%${search}%' OR nr_tel LIKE '%${search}%' OR username LIKE '%${search}%' OR datelindja LIKE '%${search}%' OR role LIKE '%${search}%')`
        }
        let getUsersQuery = `SELECT users.id, emri, mbiemri, avatar, atesia, email, nr_tel, datelindja, username, role, weekly_wage, daily_wage, monthly_wage FROM users INNER JOIN wages ON users.id = wages.user_id ${searchQuery} ${select2Query} LIMIT ${startCount}, ${endCount}`

        db.query(getUsersQuery, (err, result) => {
            const rs = JSON.parse(JSON.stringify(result))
            res.send(rs)
            return
        })
    } catch (error) {
        res.send({ message: error, status: 400 })
    }
})

//POST REQUEST TO UPLOAD IMAGE FILE
app.post("/uploadFile", (req, res) => {
    if (req.files == null) {
        res.send({ message: "No file uploaded", status: 400 })
        return
    }
    const file = req.files.image
    file.mv(`../localweb_react/public/image/${req.body.name}`, err => {
        if (err) {
            console.log(err)
            res.send({ message: err, staus: 400 })
            return
        } else {
            const path = `/image/${req.body.name}`
            let updateAvatarQuery = `UPDATE users SET avatar =  '${path}' WHERE id = ${req.body.id}`
            db.query(updateAvatarQuery, (err, result) => {
                const rs = JSON.parse(JSON.stringify(result))
                if (rs.affectedRows >= 1) {
                    res.send({ message: "Avatar Updated", status: 200, avatar: path })
                    return
                }
            })
        }
    })
})

//POST REQUEST ON /UPDATEPROFILE
app.post("/updateProfile", async (req, res) => {

    const token = req.headers.authorization

    try {
        var decoded = jwt.verify(token, config.jwt_secret);
        const id = req.body.id
        const name = req.body.name
        const surname = req.body.surname
        const fatherName = req.body.fatherName
        const email = req.body.email
        const phoneNumber = req.body.phoneNumber
        const datelindja = req.body.datelindja
        const username = req.body.username

        console.log(username)

        //REGEX VALIDATORS
        var onlyLettersRegex = /^[a-zA-Z]+$/;
        var onlyNumbersRegex = /^[0-9]+$/;
        var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

        //VALIDATE EACH DATA WE GET FROM THE REQUEST
        if (!onlyLettersRegex.test(name) || !onlyLettersRegex.test(username) || !onlyLettersRegex.test(surname) || !onlyLettersRegex.test(fatherName)) {
            res.send({ message: "Name, Surname, Fathers Name, Username should contain letters only!", status: 400 })
            return
        }
        if (!onlyNumbersRegex.test(phoneNumber)) {
            res.send({ message: "Phone number should contain only numbers!", status: 400 })
            return
        }
        if (!emailRegex.test(email)) {
            res.send({ message: "The email format you entered is incorrect!", status: 400 })
            return
        }
        if (datelindja == "") {
            res.send({ message: "Birthday cannot be empty" })
        }

        var getUserRowQuery = "SELECT * FROM users where id = ?"

        db.query(getUserRowQuery, [id], (err, result) => {

            const row = JSON.parse(JSON.stringify(result))

            //IF THE USER EMAIL == THE EMAIL WE GET FROM THE FRONTEND THAT MEANS HE DIDNT CHANGE HIS EMAIL
            if (row[0].email === email && row[0].nr_tel === phoneNumber) {

                let updateUserQuery = `UPDATE users SET emri= '${name}', mbiemri= '${surname}', atesia= '${fatherName}', nr_tel= '${phoneNumber}', email= '${email}', datelindja= '${datelindja}', username= '${username}' WHERE id= ${id}`

                db.query(updateUserQuery, (err, result) => {

                    if (err) throw err;

                    const row = JSON.parse(JSON.stringify(result))

                    if (row.affectedRows >= 1) {
                        var updatedToken = jwt.sign({ email: email }, config.jwt_secret, { expiresIn: config.jwt_expires })
                        res.send({ message: "User updated", status: 200, user: { id: id, name: name, surname: surname, email: email, fatherName: fatherName, phoneNumber: phoneNumber, datelindja: datelindja, username: username, token: updatedToken } })
                        return
                    }
                })
            }

            //IF EMAIL CHANGED AND PHONE NUMBER DIDNT CHANGE CHECK IF THE NEW EMAIL EXISTS IN THE DATABASE IF NOT UPDATE THE USER DATA
            if (row[0].email != email && row[0].nr_tel === phoneNumber) {

                let checkEmailQuery = "SELECT * FROM users where email = ?"

                db.query(checkEmailQuery, [email], (err, result) => {

                    if (result.length >= 1) {
                        res.send({ message: "A user with that email already exists!", status: 400 })
                        return
                    }
                    else {
                        let updateUserQuery = `UPDATE users SET emri= '${name}', mbiemri= '${surname}', atesia= '${fatherName}', nr_tel= '${phoneNumber}', email= '${email}', datelindja= '${datelindja}', username= '${username}' WHERE id= ${id}`

                        db.query(updateUserQuery, (err, result) => {

                            if (err) throw err;

                            const row = JSON.parse(JSON.stringify(result))

                            if (row.affectedRows >= 1) {
                                var updatedToken = jwt.sign({ email: email }, config.jwt_secret, { expiresIn: config.jwt_expires })
                                res.send({ message: "User updated", status: 200, user: { id: id, name: name, surname: surname, email: email, fatherName: fatherName, phoneNumber: phoneNumber, datelindja: datelindja, username: username, token: updatedToken } })
                                return
                            }
                        })
                    }
                })
            }
            //IF THE EMAIL DIDNT CHANGE AND THE PHONE NUMBER CHANGED CHECK IF THE NEW PHONE NUMBER EXISTS IN THE DATABASE AND IF NOT UPDATE USER DATA
            if (row[0].email === email && row[0].nr_tel != phoneNumber) {

                let checkPhoneNumberQuery = "SELECT * FROM users where nr_tel = ?"
                db.query(checkPhoneNumberQuery, [phoneNumber], (err, result) => {

                    if (result.length >= 1) {
                        res.send({ message: "A user with that phone number already exists!", status: 400 })
                        return
                    } else {
                        let updateUserQuery = `UPDATE users SET emri= '${name}', mbiemri= '${surname}', atesia= '${fatherName}', nr_tel= '${phoneNumber}', email= '${email}', datelindja= '${datelindja}', username= '${username}' WHERE id= ${id}`

                        db.query(updateUserQuery, (err, result) => {

                            if (err) throw err;

                            const row = JSON.parse(JSON.stringify(result))

                            if (row.affectedRows >= 1) {
                                var updatedToken = jwt.sign({ email: email }, config.jwt_secret, { expiresIn: config.jwt_expires })
                                res.send({ message: "User updated", status: 200, user: { id: id, name: name, surname: surname, email: email, fatherName: fatherName, phoneNumber: phoneNumber, datelindja: datelindja, username: username, token: updatedToken } })
                                return
                            }
                        })
                    }
                })
            }

        })
    } catch (err) {
        console.log(err)
    }

    return

    // ALL THE DATA BEING SENT FROM THE REQUEST

})

//POST REQUEST ON /SIGNUP
app.post("/signUp", (req, res) => {

    //ALL THE DATA BEING SENT FROM THE REQUEST
    const name = req.body.name
    const surname = req.body.surname
    const fatherName = req.body.fatherName
    const email = req.body.email
    const phoneNumber = req.body.phoneNumber
    const birthday = req.body.birthday
    const password = req.body.password

    //REGEX VALIDATORS
    var onlyLettersRegex = /^[a-zA-Z]+$/;
    var onlyNumbersRegex = /^[0-9]+$/;
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
    var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

    //VALIDATE EACH DATA WE GET FROM THE REQUEST
    if (!onlyLettersRegex.test(name) || !onlyLettersRegex.test(surname) || !onlyLettersRegex.test(fatherName)) {
        res.send({ message: "Name, Surname, Fathers Name should contain letters only!", status: 404 })
        return
    }
    if (!onlyNumbersRegex.test(phoneNumber)) {
        res.send({ message: "Phone number should contain only numbers!", status: 404 })
        return
    }
    if (!emailRegex.test(email)) {
        res.send({ message: "The email format you entered is incorrect!", status: 404 })
        return
    }
    if (!passwordRegex.test(password)) {
        res.send({ message: "Password should contain at least one number, uppercase letter, special character!", status: 404 })
        return
    }
    if (birthday == "") {
        res.send({ message: "Birthday cannot be empty!", status: 404 })
        return
    }

    /**
  * QUERYT PER TE PARE NQFS EMAILI DHE PASSWORD JANE NE DATABAZA
  */
    let emailExistsQuery = "SELECT * FROM users WHERE email= ? or nr_tel= ?";

    //IF EMAIL OR PHONE EXISTS SEND A RESPONSE WITH STATUS 400
    db.query(emailExistsQuery, [email, phoneNumber], (err, result) => {
        if (result.length >= 1) {
            res.send({ message: "A user with that email or phone number already exists!", status: 400 })
            return
        } else {
            //INSERT USER DATA TO THE DATABASE
            let sqlInsertUser = "INSERT INTO users (emri, mbiemri, atesia, email, nr_tel, password, datelindja, username, role, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            try {
                db.query(sqlInsertUser, [name, surname, fatherName, email, phoneNumber, password, birthday, "heir", "user", "../DefaultImage/default.png"], (err, result) => {
                    if (result) {
                        res.send({ message: "User registered", status: 200 })
                        res.end()
                        return
                    }
                })
            } catch (error) {
            }
        }
    })


    //EXECUTE QUERY AND SEND A RESPONSE WITH STATUS 200
})

//POST REQUEST ON /LOGIN
app.post("/login", (req, res) => {

    //DATA FROM THE REQUEST
    const email = req.body.email;
    const password = req.body.password;

    //VALIDATORS
    if (email == "" || password == "") {
        res.send({ message: "Email or Password field is empty!", status: 400 })
        return;
    }

    //QUERY TO GET THE ROW WITH THE EMAIL FROM THE REQUEST DATA
    const sqlInsertQuery = "SELECT * FROM users WHERE email= ?"

    //EXECUTE QUERY
    db.query(sqlInsertQuery, [email], (err, result) => {
        //IF THERES A RESULT CHECK IF THE PASSWORD FROM THE REQUEST DATA IS THE SAME AS THE PASSWORD FROM THE DATABASE
        if (result) {

            const row = JSON.parse(JSON.stringify(result))

            if (!row[0]) {
                res.send({ message: "The email you entered does not exist!", status: 400 })
                return
            }

            if (password == row[0].password) {
                var token = jwt.sign({ email: email }, config.jwt_secret, { expiresIn: config.jwt_expires });
                res.send({ message: "User logs in", status: 200, user: { id: row[0].id, name: row[0].emri, surname: row[0].mbiemri, fatherName: row[0].atesia, email: row[0].email, phoneNumber: row[0].nr_tel, birthday: row[0].datelindja, username: row[0].username, role: row[0].role, avatar: row[0].avatar, token: token } })
                return
            } else {
                res.send({ message: "The password you entered is incorrect!", staus: 400 })
            }
            //IF THERES AN ERROR
            if (err) {
                console.log(err)
                return
            }
        }
        res.end()
    })

})

//POST  REQUEST TO UPDATE THE USER PASSWORD
app.post("/updatePassword", (req, res) => {

    const token = req.headers.authorization

    try {
        var decoded = jwt.verify(token, config.jwt_secret)

        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword
        const confirmPassword = req.body.confirmPassword
        const id = req.body.id

        var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/

        if (!passwordRegex.test(newPassword)) {
            res.send({ message: "The new password should have at least one uppercase letter, number and special character!", status: 404 })
            return
        }
        if (newPassword != confirmPassword) {
            res.send({ message: "The passwords you entered don't match!", status: 404 })
            return
        }

        let getOldPasswordQuery = "SELECT * FROM users WHERE id = ?"

        db.query(getOldPasswordQuery, [id], (err, result) => {

            const row = JSON.parse(JSON.stringify(result))

            if (row[0].password != oldPassword) {
                res.send({ message: "The old password you entered is incorrect!", status: 400 })
                return
            } else {
                let updatePasswordQuery = `UPDATE users SET password= '${newPassword}' WHERE id= '${id}'`

                db.query(updatePasswordQuery, (err, result) => {
                    if (err) throw err
                    const queryResult = JSON.parse(JSON.stringify(result))
                    if (queryResult.affectedRows >= 1) {
                        res.send({ message: "Password updated!", status: 200 })
                        return
                    }
                })
            }
        })

    } catch (error) {
        res.send({ message: error, status: 400 })
    }
})

//GET REQUEST TO GET ALL THE USERS NAME OR REACT-SELECT COMPONENT
app.get("/select2", (req, res) => {
    const token = req.headers.authorization
    try {
        var decoded = jwt.verify(token, config.jwt_secret)
        let getUsersQuery = `SELECT * FROM users WHERE 1 = 1`
        db.query(getUsersQuery, (err, result) => {
            const row = JSON.parse(JSON.stringify(result))
            res.send({ status: 200, users: { data: row } })
            return
        })
    } catch (err) {
        console.log(err)
    }
})

app.listen(config.port, () => {
    console.log("Running on port " + config.port)
})
