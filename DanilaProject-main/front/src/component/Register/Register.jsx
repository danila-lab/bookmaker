import React, {useEffect, useState} from 'react';
import axios from "axios";

const Register = ({close}) => {
    const [form, setForm] = useState({
        email: '',
        name: '',
        password: '',
    });
    const [isFormReady, setIsFormReady] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(form.email);

        if(form.email && form.password && form.name) {
            if (isEmailValid) {
                setError('');
                setIsFormReady(true);
            } else {
                setError('Incorrect email format');
            }
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

    const changeName = (e) => {
        const name = e.target.value;
        setForm({
            ...form,
            name: name,
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
        axios.post('http://localhost:8080/auth/register', {
            email: form.email,
            name: form.name,
            password: form.password
        }).then(r => {
            setError('');
            close();
        }).catch(err => {
            if (err && err.response) {
                console.log(err.response.data);
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
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={changeName}
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
                Register
            </button>
        </div>
    );
};

export default Register;