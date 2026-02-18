import Header from "./Components/Header/header";
import React , {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';



function Login (props) {
    let Component = props.Component;
    const navigate = useNavigate();
    useEffect(() => {
        if(!localStorage.getItem("user-info"))
        {
            navigate("/login");
        }
    },[])
    return (
        <div>
            <Component />
        </div>
    );
}   

export default Login;