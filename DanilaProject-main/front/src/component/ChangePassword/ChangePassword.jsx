import React, {useCallback, useContext, useEffect, useState} from 'react';
import axios from "axios";
import { AuthContext } from '../../App';

export const ChangePassword = ({ close }) => {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: ''
    });
    const [error, setError] = useState('');
    const [isFormReady, setIsFormReady] = useState(false);
    const { authData } = useContext(AuthContext);

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

    const handleSubmit = () => {
        axios.post('http://localhost:8080/users/changepassword', {
            old_password: form.oldPassword,
            new_password: form.newPassword,
        },
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
    }).then(r => {
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
                <input
                    type="password"
                    placeholder="Old password"
                    value={form.oldPassword}
                    onChange={(e) => changeField(e, 'oldPassword')}
                />
            </div>

            <div className="Modal-input">
                <input
                    type="password"
                    placeholder="New password"
                    value={form.newPassword}
                    onChange={(e) => changeField(e, 'newPassword')}
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
    );
}

export default ChangePassword;