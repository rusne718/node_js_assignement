import { Link, useNavigate } from "react-router-dom";


const Nav = ({loggedIn, setLoggedIn}) => {
 
    const navigate = useNavigate()
    const logOut = () => {
        localStorage.removeItem('token')
        setLoggedIn(false)
        navigate('/login')
    }


    return (
       <>
        {loggedIn ? (
            <nav>
                <button>Profile</button>
                <button onClick={logOut}>Log Out</button>
            
            </nav>
        ) : (
            <nav>
                <Link to="/register"><button>Sign Up</button></Link>
                <Link to="/login"><button>Login</button></Link>
            </nav>
            )} 
        </>
    )
}

export default Nav;