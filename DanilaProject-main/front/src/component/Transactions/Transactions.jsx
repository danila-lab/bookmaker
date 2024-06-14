import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../App';
import './Transactions.scss';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const { authData } = useContext(AuthContext);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        axios.get('http://localhost:8080/users/transactions?id=' + authData.id,
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(r => {
                console.log(r.data);
                setTransactions(r.data);
            }).catch(err => {
                console.log(err)
            });
    };

    const renderWithdraw = (transaction) => {
        return (
            <li className='Transactions-Item' key={transaction.id + transaction.receiver}>
                <p style={{color: "#40e00f", width: "30%"}}>+{transaction.amount}€&nbsp;</p>
                <p style={{width: "30%"}}>Bank Acc Number: {transaction.receiver}&nbsp;</p>
                <p style={{width: "30%"}}>Date: {new Date(transaction.date).toLocaleString()}</p>
            </li>
        )
    }

    const renderDeposit = (transaction) => {
        return (
            <li className='Transactions-Item' key={transaction.id + transaction.payment_method}>
                <p style={{color: "#ff4c3f", width: "30%"}}>-{transaction.amount}€</p>
                <p style={{width: "30%"}}>Method: {transaction.payment_method}</p>
                <p style={{width: "30%"}}>Date: {new Date(transaction.date).toLocaleString()}</p>
            </li>
        )
    }

    return (
        <div>
            <h1>Transactions</h1>
            <ul>
                {transactions.map((transaction) => (
                    transaction.receiver ? renderWithdraw(transaction) : renderDeposit(transaction)
                ))}
            </ul>
        </div>
    );
};

export default Transactions;