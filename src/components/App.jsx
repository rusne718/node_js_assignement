import React from 'react';
import './App.css'
import Register from './Register';
import Login from './Login'
import Nav from './Navigation';
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';


function App() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState()
  const [data, setData] = useState()

  const getUsers = async () => {
    await fetch('http://localhost:8080/addUsers')
      .then(res => res.json())
      .then(data => {
        setData(data)
        console.log(data)
      }) 
  }

  useEffect(() => {

    const token = localStorage.getItem('token')
    if(token) setLoggedIn(true)
    getUsers()
   
    fetch("/verifyToken", {
    headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    })
    .then((res) => res.json())
    .then((data) => {
    if (data.verify === false) {
    setLoggedIn(false);
    } else {
    setLoggedIn(true);
    setUser({ username: data.username, id: data.id });
    }
    });
  },[])

  return (

    <div>
      <Nav loggedIn={loggedIn} setLoggedIn={setLoggedIn} user={user}/>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login setUser={setUser} setLoggedIn={setLoggedIn}/>} />
        <Route path="/profileDashboard" element={<ProfileDashboar loggedIn={loggedIn} data={data} user={user}/>} />
      </Routes>

      <div className='App'>

      </div>

    </div>
  );
}

export default App;