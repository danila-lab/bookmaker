import React, { useContext, useEffect, useState } from 'react';
import './Profile.scss';
import { AuthContext } from '../../App';
import axios from 'axios';
import Modal from '../../component/Modal/Modal';
import ChangePassword from '../../component/ChangePassword/ChangePassword';
import Ban from './Ban';

const ProfileInfo = () => {
    const { authData } = useContext(AuthContext);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    const openModal = () => {
        setIsChangePasswordModalOpen(true);
    };

    const closeModal = () => {
        setIsChangePasswordModalOpen(false);
    }

    const openBanModal = () => {
        setIsBanModalOpen(true);
    };

    const closeBanModal = () => {
        setIsBanModalOpen(false);
    }


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
        <div className="ProfileInfo">
            <Modal content={<ChangePassword close={closeModal} />} isOpen={isChangePasswordModalOpen} close={closeModal} />
            <Modal content={<Ban close={closeBanModal} />} isOpen={isBanModalOpen} close={closeBanModal} />
            {user && (
                <div className='ProfileInfo-Info'>
                    <p>Email: {user.email}</p>
                    <p>Name: {user.name}</p>
                    <p>Role: {user.role.name}</p>
                    <p>Balance: {user.balance}€</p>
                    <button className="Button_secondary" onClick={openModal}>Change password</button>
                    {user.role.name !== 'admin' && (
                    <div style={{marginTop: "20px"}}>
                        <button className="Button" onClick={openBanModal} style={{backgroundColor: "rgb(230,20,20)", color: "white", padding:"20px"}}>Ban Myself</button>
                    </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileInfo;