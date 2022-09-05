import { useNavigate } from "react-router-dom";

const Login = ({setUser, setLoggedIn}) => {

    const navigate = useNavigate()
    const loginUser = async (e) => {
        e.preventDefault();
        
        const user = {
            username: e.target.username.value,
            password: e.target.password.value
        } 
        await fetch('http://localhost:5000/login', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then((res) => res.json())
        .then((data) => {
        if (data.err) return alert(data.err);
        setUser(data);
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
        navigate("/home", { replace: true });
        })
        .catch((error) => console.log(error));
            }
     
    return(

        <div className="login-form">

            <form onSubmit={loginUser}>
            <h1>Login</h1>
            <label>Username</label>
            <input type="text" name="username" />

            <label> Password</label>
            <input type="password" name="password"/>

            <button type="submit">Login</button>
            </form>
            <a href="/register">Register</a>
        </div>

        
    )
}

export default Login;