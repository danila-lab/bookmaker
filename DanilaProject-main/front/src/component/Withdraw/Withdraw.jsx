import React, { useContext, useEffect, useState } from 'react';
import './Withdraw.scss';
import { AuthContext } from '../../App';
import axios from 'axios';
import { format2Num } from '../../util/format';

const Withdraw = () => {
    const [form, setForm] = useState({
        amount: '',
        receiver: '',
    });
    const { authData } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [isFormReady, setIsFormReady] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const formValues = Object.values(form);
        const isFilled = formValues.every(value => value !== '' && value !== null);

        setIsFormReady(isFilled);
    }, [form]);

    const changeField = (e, field) => {
        setForm({
            ...form,
            [field]: e.target.value,
        });
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = () => {
        axios.get('http://localhost:8080/users/info?id=' + authData.id, {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(r => {
            setUser(r.data);
        }).catch(e => {
            console.log(e);
        });
    }

    const handleSubmit = () => {
        axios.post('http://localhost:8080/users/withdraw', {
            id: authData.id,
            amount: form.amount,
            receiver: form.receiver,
        },
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
    }).then(r => {
            console.log(r.data);
            fetchUser();
            setError('');
        }).catch(err => {
            console.log(err)
            fetchUser();
            if (err && err.response) {
                setError(err.response.data.error);
            }
        });
    }

    return (
        <div className="Payments">
            <h1>Withdraw</h1>

            <p>Current balance: {user ? user.balance : '...'}€</p>

            <div className="Modal-Error">
                {error}
            </div>

            <div>
                <input
                    type="text"
                    className="Input"
                    placeholder='Amount €'
                    value={form.amount}
                    onChange={(e) => changeField(e, 'amount')}
                />
            </div>

            <div style={{marginTop: "20px"}}>
                <input
                    type="text"
                    className="Input"
                    placeholder='Bank account number'
                    value={form.receiver}
                    onChange={(e) => changeField(e, 'receiver')}
                />
            </div>
            <div style={{marginTop: "20px"}}>
                <button
                    style={{paddingInline: "20px", width: "377px"}}
                    className={`Button Modal-button ${isFormReady ? '' : 'Button_disabled'}`}
                    onClick={handleSubmit}
                    disabled={!isFormReady}
                >
                    Withdraw
                </button>
            </div>
        </div>
    );
};

export default Withdraw;