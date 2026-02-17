import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from './header';

function Register () 
{
    useEffect(() => {
        if(localStorage.getItem("user-info"))
        {
            navigate("/AddProduct");
        }
    },[])
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');   
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    
    async function signUp()
    {
        let item = {name, password, email};
        console.warn(item);
        let result = await fetch("http://localhost:8000/api/register", {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify(item)
        })
         result=await result.json();
        localStorage.setItem("user-info", JSON.stringify(result));
         navigate("/AddProduct");
    }

    return (
        <>
        <Header />
        <div className="col-sm-6 offset-sm-3">
            <h1>Register Page</h1>
            <input type="text" className="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /> <br />
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
            <button className="btn btn-primary" onClick={signUp}>Sign Up</button>
        </div>
        </>
    );
}

export default Register;