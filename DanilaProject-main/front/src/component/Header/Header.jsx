import React, {useContext, useState} from 'react';
import './Header.scss';
import Modal from "../Modal/Modal";
import Register from "../Register/Register";
import Login from "../Login/Login";
import {AuthContext} from "../../App";
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const { authData, updateAuthData, isLoginOpen, setIsLoginOpen } = useContext(AuthContext);

    const openLogin = () => {
        setIsLoginOpen(true);
    }
    const closeLogin = () => {
        setIsLoginOpen(false);
    }

    const openRegister = () => {
        setIsRegisterModalOpen(true);
    }
    const closeRegister = () => {
        setIsRegisterModalOpen(false);
    }

    const logout = () => {
        localStorage.removeItem('user');
        updateAuthData({});
    }

    const handleProfile = () => {
        navigate('/profile');
    }

    const renderButtons = () => {
        if (!authData.id) {
            return (
                <div>
                    <button
                        className="Button Header-Buttons-Button"
                        onClick={openRegister}
                    >
                        Register
                    </button>
                     <Modal isOpen={isRegisterModalOpen} close={closeRegister} content={<Register close={closeRegister} />}/>
                    <button
                        className="Button_secondary Header-Buttons-Button"
                        onClick={openLogin}
                    >
                        Login
                    </button>
                    <Modal isOpen={isLoginOpen} close={closeLogin} content={<Login close={closeLogin} />} />
                </div>
            );
        }

        return (
            <div>
                {authData.role === 'admin' &&
                    <button className="Button Header-Buttons-Button" onClick={() => {navigate('/admin')}}>
                        Admin Panel
                    </button>
                }
                <button
                    className="Button Header-Buttons-Button"
                    onClick={handleProfile}
                >
                    Profile
                </button>

                <button
                    className="Button Header-Buttons-Button"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="Header">
            <div className="Header-Logo" onClick={() => navigate('/games')}>
                <div className="Header-Logo-Img"></div>
                <h1 className="Header-Logo-Title">eWager</h1>

            </div>

            <div className="Header-Buttons" style={{display: "flex"}}>
                <button className="Button_secondary Header-Buttons-Button" onClick={() => {navigate('/about')}}>
                    About us
                </button>
                <button style={{marginRight: "50px"}} className="Button_secondary Header-Buttons-Button" onClick={() => {navigate('/contacts')}}>
                    Contacts
                </button>


                { renderButtons() }
            </div>
        </div>
    );
};

export default Header;