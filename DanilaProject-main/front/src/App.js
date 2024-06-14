import './App.scss';
import Header from './component/Header/Header';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import GamesPage from "./pages/GamesPage/GamesPage";
import React, {useEffect, useState} from "react";
import AdminPanel from './pages/AdminPanel/AdminPanel';
import axios from 'axios';
import Profile from './pages/Profile/Profile';
import About from './pages/About/About';
import Contacts from './pages/Contacts/Contacts';

export const AuthContext = React.createContext();
function App() {
    const [authData, setAuthData] = useState({
        id: null,
        email: null,
        jwt: null,
        balance: null,
        role: null,
    });
    useEffect(() => {
        const json = localStorage.getItem('user');
        const user = json ? JSON.parse(json) : null;
        if (user) {
            fetchUserByJwt(user.jwt);
        }
    }, []);

    const fetchNewUserData = () => {
        fetchUserByJwt(authData.jwt);
    };

    const fetchUserByJwt = (jwt) => {
        axios.post('http://localhost:8080/auth/token', {
                token: jwt,
            }).then(r => {
                const fetchedUser = r.data;
                const updatedUser = {
                    id: fetchedUser.id,
                    email: fetchedUser.email,
                    jwt: jwt,
                    balance: fetchedUser.balance,
                    role: fetchedUser.role.name,
                }
                console.log(updatedUser);
                updateAuthData(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }).catch(err => {
                localStorage.removeItem('user');
            });
    }

    const [isLoginOpen, setIsLoginOpen] = useState(false);

    useEffect(() => {
        console.log(authData)
    }, [authData]);

    const updateAuthData = (data) => {
        setAuthData(data);
    };



    const renderAdminRoutes = () => {
        if(authData.role === 'admin') {
            return (
                <Route path="/admin" element={<AdminPanel/>}/>
            );
        }

        return null;
    }

    const renderUserRoutes = () => {
        if(authData.id) {
            return (
                <Route path="/profile" element={<Profile/>}/>
            );
        }

        return null;
    }

    return (
        <AuthContext.Provider value={{ authData, updateAuthData, isLoginOpen, setIsLoginOpen, fetchNewUserData }}>
            <BrowserRouter>
                <Header/>
                <div className="App">
                    <Routes>
                        <Route
                            path=""
                            element={<Navigate to="/games" replace />}
                        />

                        <Route path="/games" element={<GamesPage/>} />

                        <Route
                            path="/games/:type"
                            element={<GamesPage/>}
                        />

                        <Route
                            path="/about"
                            element={<About/>}
                        />

                        <Route
                            path="/contacts"
                            element={<Contacts />}
                        />

                        <Route
                            path="/contacts"
                            element={<GamesPage/>}
                        />

                        { renderUserRoutes() }
                        { renderAdminRoutes() }
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
