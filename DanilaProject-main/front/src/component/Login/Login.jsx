import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import { AuthContext } from '../../App';

const Login = ({close}) => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const { updateAuthData } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [isFormReady, setIsFormReady] = useState(false);

    useEffect(() => {
        if(form.email && form.password) {
            setIsFormReady(true);
        } else {
            setIsFormReady(false);
        }
    }, [form]);
    const changeEmail = (e) => {
        const email = e.target.value;
        setForm({
            ...form,
            email: email,
        });
    }

    const changePassword = (e) => {
        const password = e.target.value;
        setForm({
            ...form,
            password: password,
        });
    }

    const handleSubmit = () => {
        axios.post('http://localhost:8080/auth/login', {
            email: form.email,
            password: form.password
        }).then(r => {
            const user = {
                email: form.email,
                id: r.data.id,
                jwt: r.data.token,
                balance: r.data.balance,
                role: r.data.role,
            };
            updateAuthData(user);
            localStorage.setItem('user', JSON.stringify(user));

            console.log(r.data);
            setError('');
            close();
        }).catch(err => {
            if (err && err.response) {
                setError(err.response.data.error);
            }
        });
    }

    return (
        <div>
            <div className="Modal-Error">
                {error}
            </div>
            <div className="Modal-input">
                <input
                    type="text"
                    placeholder="Email"
                    value={form.email}
                    onChange={changeEmail}
                />
            </div>

            <div className="Modal-input">
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={changePassword}
                />
            </div>

            <button
                className={`Button Modal-button ${isFormReady ? '' : 'Button_disabled'}`}
                onClick={handleSubmit}
                disabled={!isFormReady}
            >
                Log In
            </button>
        </div>
    );
};

export default Login;