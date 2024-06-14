import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import { AuthContext } from '../../App';

const Ban = ({close}) => {
    const { authData, updateAuthData } = useContext(AuthContext);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        // axios.post('http://localhost:8080/users/banmyself', {
        //     headers: {
        //         'Authorization': `Bearer ${authData.jwt}`,
        //     },
        // }).then(r => {
        //     updateAuthData(null);
        //     localStorage.removeItem('user');

        //     console.log(r.data);
        //     setError('');
        //     close();
        // }).catch(err => {
        //     console.log(err)
        //     if (err && err.response) {
        //         setError(err.response.data.error);
        //     }
        // });
        axios.post('http://localhost:8080/users/banmyself', {

        },
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(r => {
            localStorage.removeItem('user');
            updateAuthData({});

            console.log(r.data);
            setError('');
            close();
        }).catch(err => {
            console.log(err)
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
                <p>Are you sure you want to ban? Ban will be forever</p>
            </div>

            <button
                className={`Button Modal-button`}
                onClick={handleSubmit}
            >
                Confirm
            </button>
        </div>
    );
};

export default Ban;