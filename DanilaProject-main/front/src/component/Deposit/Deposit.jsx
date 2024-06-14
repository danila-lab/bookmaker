import React, { useContext, useEffect, useState } from 'react';
import './Deposit.scss';
import { AuthContext } from '../../App';
import axios from 'axios';
import Modal from '../Modal/Modal';
import ChangePassword from '../ChangePassword/ChangePassword';
import Card from './Card';

const Deposit = () => {
    const [form, setForm] = useState({
        amount: '',
        type: '',
    });
    const { authData } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isFormReady, setIsFormReady] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    }

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
        axios.get('http://localhost:8080/users/info?id=' + authData.id, {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(r => {
            setUser(r.data);
        }).catch(e => {
            console.log(e);
        })
    }, []);

    return (
        <div className="Payments">
            <Modal isOpen={isModalOpen} close={closeModal} content={<Card close={closeModal} amount={form.amount}/>} />
            <h1>Deposit</h1>

            <div>
                <input
                    type="text"
                    className="Input"
                    placeholder='Amount €'
                    value={form.amount}
                    onChange={(e) => changeField(e, 'amount')}
                />
            </div>

            <div>
                <select className='Select' style={{width: '200px', height: "40px", marginTop: "20px"}} value={form.type}
                    onChange={(e) => changeField(e, 'type')}>
                    <option value="" disabled selected>Payment method</option>
                    <option value="card">Credit card</option>
                </select>
            </div>

            <div style={{marginTop: "20px"}}>
                <button
                    style={{paddingInline: "20px", width: "377px"}}
                    className={`Button Modal-button ${isFormReady ? '' : 'Button_disabled'}`}
                    onClick={openModal}
                    disabled={!isFormReady}
                >
                    Deposit
                </button>
            </div>
        </div>
    );
};

export default Deposit;