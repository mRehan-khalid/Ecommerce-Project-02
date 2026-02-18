import Header from '../Header/header';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import './login.css';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("user-info")) {
            navigate("/searchProduct");
        }
    }, [])
async function handleLogin() {

    if (email.length < 3 || !email.includes("@")) {
        toast.error("Please enter a valid email");
        return;
    }

    if (!password.length) {
        toast.warning("Please enter a password to Continue!");
        return;
    }

    setLoading(true);

    try {
        let response = await fetch("http://localhost:8000/api/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        let result = await response.json();
        
        setLoading(false);
        
        if (result.success) {
            
            localStorage.setItem("user-info", JSON.stringify(result));
            
            toast.success("Successfully LoggedIn!", {
               position: "top-right",
               autoClose: 1000, 
            });
        setTimeout(() => {
            if (result.user.user_role === "admin") {
                navigate("/AddProduct");
            } else {
                navigate("/");
            }
         }, 1000);    
        } else{
            toast.error(result.message || "Invalid Email or Password");
        }
    } catch (error) {
        setLoading(false);
        toast.error("Server Side Error 500");
    }
}
    return (
        <div>
            <ToastContainer  
                className="loginToastMessage"
                position="top-right" 
                autoClose={3000} 
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className='loginPage'
        >
            <MDBContainer fluid className='contentForLogin'>

                <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                    <MDBCol col='12'>

                        <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '450px', maxHeight: '100vw', backgroundColor: 'White' }}>
                            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

                                <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                <p className="text-white-50 mb-5">Please enter your login and password!</p>

                                <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address' id='formControlLg' type='email' size="lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id='formControlLg' type='password' size="lg" value={password} onChange={(e) => setPassword(e.target.value)} />

                                <p className="small mb-3 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>
                                <button outline className='mx-2 px-5 loginButton' color='white' size='lg' onClick={() => handleLogin()} disabled={loading} >
                                    {loading ? (
                                        <Spinner animation="border" size="sm" variant="light" />
                                    ) : (
                                        "Login"
                                    )}
                                </button>


                                <div className='d-flex flex-row mt-3 mb-5'>
                                    <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                                        <MDBIcon fab icon='facebook-f' size="lg" />
                                    </MDBBtn>

                                    <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                                        <MDBIcon fab icon='twitter' size="lg" />
                                    </MDBBtn>

                                    <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                                        <MDBIcon fab icon='google' size="lg" />
                                    </MDBBtn>
                                </div>

                                <div>
                                    <p className="mb-0">Don't have an account? <a href="#!" class="text-white-50 fw-bold" onClick={() => navigate("/Register")}>Sign Up</a></p>

                                </div>
                            </MDBCardBody>
                        </MDBCard>

                    </MDBCol>
                </MDBRow>

            </MDBContainer>
        </motion.div>
        </div>
    );
}
export default Login;