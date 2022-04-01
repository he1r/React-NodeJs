import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { selectUser } from '../redux/features/user'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../redux/features/user'
import { selectAddUser } from '../redux/features/user'

const FileUpload = (props) => {

    //GET ALL THE USERS ARRAY
    const selectaddUser = useSelector(selectAddUser)

    //GET ONLY THE USER WITH THE ID PROVIDED FROM THE ADMIN PAGE
    const usr = selectaddUser.filter(row =>
        row.id === props.id)

    const user = useSelector(selectUser)

    const [id, setId] = useState(null)
    const [avatar, setAvatar] = useState(null)

    useEffect(() => {
        if (props.id) {
            setId(usr[0].id)
            setAvatar(usr[0].avatar)
        } else {
            setId(user.id)
            setAvatar(user.avatar)
        }
    }, [props.id, usr, user.id, user.avatar])

    const dispatch = useDispatch()

    const [selectedFile, setSelectedFile] = useState(null)

    function fileSelectedHandler(e) {
        setSelectedFile(e.target.files[0])
    }

    function uploadImage(e) {
        e.preventDefault()
        const fd = new FormData()
        fd.append('image', selectedFile)
        fd.append('name', selectedFile.name)
        fd.append('id', id)

        axios.post("http://localhost:3001/uploadFile", fd).then((result) => {

            if (result.data.status === 200) {
                if (!props.id) {
                    setAvatar(result.data.avatar)
                    dispatch(login({
                        id: user.id,
                        name: user.name,
                        surname: user.surname,
                        email: user.email,
                        fatherName: user.fatherName,
                        role: user.role,
                        phoneNumber: user.phoneNumber,
                        datelindja: user.datelindja,
                        username: user.username,
                        avatar: result.data.avatar,
                        token: user.token
                    }))
                }
            }
        })
    }
    return (
        <div className="text-center">
            <div className='img-div' style={{ marginBottom: 20 }}>
                <img style={{ height: 120, width: 120, borderRadius: 100 }} alt="User Avatar" src={avatar}></img>
            </div>
            <div>
                <input type="file" name="image-upload" className='image-upload-button' onChange={(e) => fileSelectedHandler(e)} />

                <div>
                    <button onClick={(e) => uploadImage(e)} className="btn" style={{ marginTop: 20 }}>Update</button>
                </div>

                <div className="label">
                    <label htmlFor="input" className="image-upload">
                    </label>
                </div>
            </div>
        </div>

    )
}
export default FileUpload;
