import Header from './header';
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


function Login() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("user-info")) {
            navigate("/AddProduct");
        }
    }, [])
    async function Login() {
        let item = { email, password };
        let result = fetch("http://localhost:8000/api/login", {
            method: 'POST', 
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify(item)
        });
        result = (await result).json();
        localStorage.setItem("user-info", JSON.stringify(result));
        navigate("/AddProduct");
    }
    return (
        <div>
            <Header />
            <h1>Login Page</h1>
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> 
            <br /> <br />         
            <button className="btn btn-primary" onClick={Login}>Login</button>
        </div>
    );
}
export default Login;