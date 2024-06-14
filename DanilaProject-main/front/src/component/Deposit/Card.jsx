import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import { AuthContext } from '../../App';
import { saveAs } from 'file-saver';

export const Card = ({ close, amount }) => {
    const [form, setForm] = useState({
        number: '',
        holder: '',
        date: '',
        cvv: ''
    });
    const [error, setError] = useState('');
    const [isFormReady, setIsFormReady] = useState(false);
    const { authData } = useContext(AuthContext);
    const [isLastStep, setIsLastStep] = useState(false);
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        const formValues = Object.values(form);
        const isFilled = formValues.every(value => value !== '' && value !== null);

        if(!isFilled) {
            setIsFormReady(false);
            return;
        }

        if(form.number.toString().length !== 16) {
            setError('Card number should have 16 numbers');
            setIsFormReady(false);
            return;
        } else {
            setError('')
        }

        if(form.cvv.toString().length !== 3) {
            setError('CVV should have 16 numbers');
            setIsFormReady(false);
            return;
        } else {
            setError('')
        }

        setIsFormReady(isFilled);
    }, [form]);

    const changeField = (e, field) => {
        setForm({
            ...form,
            [field]: e.target.value,
        });
    };

    const handleDownload = () => {
        saveAs(invoice, 'invoice.pdf');
    }

    const handleSubmit = () => {
        axios.post('http://localhost:8080/users/deposit', {
            id: authData.id,
            amount: amount,
            payment_method: "card",
        },
        {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
    }).then(r => {
        setIsLastStep(true);
        const blob = new Blob([r.data], { type: 'application/pdf' });
        setInvoice(blob);
        setError('');
    }).catch(err => {
        console.log(err)
        if (err && err.response) {
            setError(err.response.data.error);
        }
    });
    }

    return (
        isLastStep ? (
        <div>
            <h1>Thank you for your deposit</h1>
            <button
                className={`Button Modal-button`}
                onClick={handleDownload}
                style={{marginTop: "20px"}}
            >
                Download Invoice
            </button>
        </div>
        ) : (
        <div>
            <h1>Enter Credit Card Details</h1>
            <div className="Modal-Error">
                {error}
            </div>
            <div className="Modal-input">
                <p>Card Number:</p>
                <input
                    type="number"
                    placeholder="1234 5678 9012 3456"
                    value={form.number}
                    onChange={(e) => changeField(e, 'number')}
                />
            </div>

            <div className="Modal-input">
                <p>Card Holder:</p>
                <input
                    type="text"
                    placeholder="John Doe"
                    value={form.holder}
                    onChange={(e) => changeField(e, 'holder')}
                />
            </div>

            <div className="Modal-input">
                <p>Expire Date:</p>
                <input
                    type="text"
                    placeholder="MM/YY"
                    value={form.date}
                    onChange={(e) => changeField(e, 'date')}
                />
            </div>

            <div className="Modal-input">
                <p>CVV:</p>
                <input
                    type="number"
                    placeholder="123"
                    value={form.cvv}
                    onChange={(e) => changeField(e, 'cvv')}
                />
            </div>

            <button
                className={`Button Modal-button ${isFormReady ? '' : 'Button_disabled'}`}
                onClick={handleSubmit}
                disabled={!isFormReady}
            >
                Change
            </button>
        </div>
        )
    );
}

export default Card;