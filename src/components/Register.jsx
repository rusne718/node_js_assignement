import { useNavigate } from "react-router-dom";

const Register = () => {

const navigate = useNavigate()    
const addUser = async (e) => {
        e.preventDefault();

        const user = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value
        } 

        if( e.target.password.value !== e.target.repeatPassword.value) 
        alert("password didn't match")

        await fetch('http://localhost:5000/register', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(() => navigate("/login", { replace: true }))

        .catch((error) => console.log(error));

    }
     
    return(

        <div className="register-form">

            <form onSubmit={addUser}>
            <h1> Registration </h1>

            <label>Username</label>
            <input type="text" name="username" />
            <br/>

            <label>Email</label>
            <input type="email" name="email"/>
            <br/>

            <label> Password</label>
            <input type="password" name="password"/>
            <br/>

            <label> Repeat Password</label>
            <input type="password" name="repeatPassword"/>
            <br/>

            <button type="submit">Register</button>
            </form>

            <a href="/login">Login</a>
        </div>

        
    )
}

export default Register;