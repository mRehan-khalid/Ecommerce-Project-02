import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/header';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBIcon
} from 'mdb-react-ui-kit';
import { motion } from "framer-motion";
import "./register.css"
import Spinner from 'react-bootstrap/Spinner';

function Register() {
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("user-info"));
        const user = userInfo.user;
        if (localStorage.getItem("user-info")) {
             if(user && user.id){
            navigate("/AddProduct");
            }
        }
    }, [])
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function signUp() {

        if (name.length < 3) {
            alert("Please Enter a Valid Name")
        }
        if (email.length < 3 || !email.includes("@")) {
            alert("Please enter a valid email");
            return;
        }
        const passwordRegex = /^(?=.*[A-Z]).{6,}$/;
        if (!passwordRegex.test(password)) {
            alert("Password must be at least 6 characters long and include at least one capital letter");
            return;
        }
        setLoading(true);
        let item = { name, password, email };
        console.warn(item);
        let response = await fetch("http://localhost:8000/api/register", {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            },
            body: JSON.stringify(item)
        })
        if (response.status === 409) {
            let data = await response.json();
            alert(data.message);
            setLoading(false);
            return;
        }

        if (!response.ok) {
            alert("Something went wrong");
            setLoading(false);
            return;
        }

        let result = await response.json();

        localStorage.setItem("user-info", JSON.stringify(result));
        setLoading(false);
        navigate("/login");
    }

    return (



        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className='signUpPage'>
            <MDBContainer fluid >

                <MDBRow className='d-flex justify-content-center align-items-center h-100' style={{ 'backgroundColor': 'rgba(51, 45, 45, var(--mdb--bg-opacity))' }}>
                    <MDBCol col='12'>

                        <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
                            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

                                <h2 className="fw-bold mb-2 text-uppercase signUpHeading">Sign Up</h2>
                                <p className="text-white-50 mb-5 signUpSubheading">Welcome to Our E-commerce Platform! </p>

                                <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Name' id='formControlLg' type='name' size="lg" value={name} onChange={(e) => setName(e.target.value)} />
                                <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address' id='formControlLg' type='email' size="lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id='formControlLg' type='password' size="lg" value={password} onChange={(e) => setPassword(e.target.value)} />

                                <p className="small mb-3 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>
                                <button outline className='mx-2 px-5 registerButton' color='white' size='lg' onClick={() => signUp()} style={{ 'backgroundColor': 'white' }} disabled={loading}>
                                    {loading ? (
                                        <Spinner animation="border" size="sm" variant="light" />
                                    ) : (
                                        "SignUp"
                                    )}
                                </button>

                                <div className='d-flex flex-row mt-5 mb-2'>

                                </div>

                                <div>
                                    <p className="mb-0">Already have an account? <a href="#!" class="text-white-50 fw-bold" onClick={() => navigate("/login")}>Login</a></p>

                                </div>
                            </MDBCardBody>
                        </MDBCard>

                    </MDBCol>
                </MDBRow>

            </MDBContainer>
        </motion.div>
    );
}

export default Register;