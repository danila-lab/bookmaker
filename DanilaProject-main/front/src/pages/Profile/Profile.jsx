import React, { useContext, useEffect, useState } from 'react';
import './Profile.scss';
import { AuthContext } from '../../App';
import axios from 'axios';
import ProfileInfo from './ProfileInfo';
import Deposit from '../../component/Deposit/Deposit';
import Transactions from '../../component/Transactions/Transactions';
import Withdraw from '../../component/Withdraw/Withdraw';

const Tabs = {
    INFO: {
        name: 'info',
        content: <ProfileInfo />
    },
    DEPOSIT: {
        name: 'deposit',
        content: <Deposit />
    },
    WITHDRAW: {
        name: 'withdraw',
        content: <Withdraw />
    },
    TRANSACTIONS: {
        name: 'transactions',
        content: <Transactions />
    },
};

const Profile = () => {
    const [selectedTab, setSelectedTab] = useState(Tabs.INFO);
    const queryParams = new URLSearchParams(window.location.search);
    const isDeposit = queryParams.get('deposit') ? true : false;
    useEffect(() => {
        if (isDeposit) {
            setSelectedTab(Tabs.DEPOSIT);
        }
    }, [isDeposit])

    const renderMenu = () => {
        return (
            <div className="Profile-Menu">
                <div className={`Profile-Menu-Item ${selectedTab === Tabs.INFO ? 'Profile-Menu-Item_selected' : ''}`} onClick={() => setSelectedTab(Tabs.INFO)}>Info</div>
                <div className={`Profile-Menu-Item ${selectedTab === Tabs.DEPOSIT ? 'Profile-Menu-Item_selected' : ''}`} onClick={() => setSelectedTab(Tabs.DEPOSIT)}>Deposit</div>
                <div className={`Profile-Menu-Item ${selectedTab === Tabs.WITHDRAW ? 'Profile-Menu-Item_selected' : ''}`} onClick={() => setSelectedTab(Tabs.WITHDRAW)}>Withdraw</div>
                <div className={`Profile-Menu-Item ${selectedTab === Tabs.TRANSACTIONS ? 'Profile-Menu-Item_selected' : ''}`} onClick={() => setSelectedTab(Tabs.TRANSACTIONS)}>Transactions</div>
            </div>
        );
    }

    return (
        <div className="Profile">
            { renderMenu() }
            <div className="Profile-Content">
                {selectedTab.content}
            </div>
        </div>
    );
};

export default Profile;