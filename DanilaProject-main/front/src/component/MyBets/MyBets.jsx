import React, {useContext, useEffect, useState} from 'react';
import './MyBets.scss';
import {AuthContext} from "../../App";
import axios from "axios";
import ActiveBets from '../ActiveBets/ActiveBets';
import BetsHistory from '../BetsHistory/BetsHistory';

const List = {
    ACTIVE: 'active',
    HISTORY: 'history',
}

const MyBets = ({close}) => {
    const { authData } = useContext(AuthContext);
    const [selectedList, setSelectedList] = useState(List.ACTIVE);
    const [bets, setBets] = useState([]);
    const [sort, setSort] = useState(null);

    useEffect(() => {
        fetchBets();
    }, [selectedList, sort]);

    const fetchBets = () => {
        const s = sort?.split('_') || null;
        const sortBy = s && s[0];
        const order = s && s[1];
        const url = `http://localhost:8080/bet?active=${selectedList === List.ACTIVE ? '1' : '0'}&sort=${sortBy}&order=${order}`;
        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(r => {
            setBets(r.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    const handleChangeList = (list) => {
        setSelectedList(list);
    }

    const handleSortChange = (e) => {
        setSort(e.target.value)
    }

    return (
        <div className="MyBets">
            <div className="MyBets-Header">
                <button
                    className={`Button_secondary ${selectedList === List.ACTIVE ? 'Button_secondary_selected' : ''}`}
                    onClick={() => handleChangeList(List.ACTIVE)}
                >
                    Active bets
                </button>
                <button
                    className={`Button_secondary ${selectedList === List.HISTORY ? 'Button_secondary_selected' : ''}`}
                    onClick={() => handleChangeList(List.HISTORY)}
                >
                    History
                </button>
            </div>

            <div className="MyBets-Sort" style={{marginBottom: '20px'}}>
                <select className='Select' style={{width: "200px"}} value={sort} onChange={handleSortChange}>
                    <option value={null} disabled selected>Sort</option>
                    <option value="id_desc">Newest</option>
                    <option value="id_asc">Oldest</option>
                    <option value="amount_asc">Amount: Low to High</option>
                    <option value="amount_desc">Amount: High to Low</option>
                    <option value="date_desc">Date: Descending</option>
                    <option value="date_asc">Date: Ascending</option>
                </select>
            </div>

            {selectedList === List.ACTIVE ? (
                <ActiveBets bets={bets} />
            ) : (
                <BetsHistory bets={bets} />
            )}
        </div>
    );
};

export default MyBets;