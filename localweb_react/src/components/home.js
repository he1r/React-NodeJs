import { selectUser } from '../redux/features/user'
import { useSelector } from 'react-redux'
import React from 'react'
import '../css/Profile.css'

//HOME COMPONENT
export function Home() {

    const user = useSelector(selectUser)
    if (!user.token) {
        window.location.href = "/"
    }
    return (
        <div className='homeDiv'>
            <h1 className='userName'>User: {user.name} {user.surname}</h1>
        </div>
    )
}
export default Home