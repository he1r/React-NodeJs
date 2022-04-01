import React, { useEffect } from 'react'
import '../css/Sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faChartLine, faUser, faHouseChimneyUser, faFolder, faBroadcastTower } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { login } from '../redux/features/user'
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/features/user'
import { useState } from 'react'
function Sidebar() {

    const user = useSelector(selectUser)

    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        if (user.role === "admin") {
            setIsAdmin(true)
        }
        if (user.token != null) {
            setIsLoggedIn(true)
        }
    }, [user.role, user.token])

    function signOut() {

        dispatch(login({
            id: null,
            name: null,
            surname: null,
            fatherName: null,
            email: null,
            phoneNumber: null,
            birthday: null,
            username: null,
            role: null,
            avatar: null,
            token: null
        }
        ))
    }

    return (
        <div>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <div className="navbar bg-dark flex-row">
                <div className='brand'>

                    <span className="fs-4"><FontAwesomeIcon icon={faBroadcastTower} /> LocalWeb</span>
                </div>

                <div className=''>
                    {isLoggedIn && <a href="/home"><FontAwesomeIcon icon={faHouseChimneyUser} /> Home</a>}
                    {isLoggedIn && <a href="/profile" ><FontAwesomeIcon icon={faUser} /> Profile</a>}
                    {isAdmin && <a href="/admin"><FontAwesomeIcon icon={faFolder} />  Admin</a>}
                    {isAdmin && <a href="/Products"><FontAwesomeIcon icon={faChartLine} />  Products</a>}
                    {isLoggedIn && <a href="/" onClick={signOut}><FontAwesomeIcon icon={faRightFromBracket} /> Sign Out</a>}
                </div>
            </div>
        </div>
    )
}

export default Sidebar