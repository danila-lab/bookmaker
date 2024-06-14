import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import { AuthContext } from '../../App';
import { format2Num, formatGameDate } from '../../util/format';

export const AdminUsersDetails = ({ close, user }) => {
    const [form, setForm] = useState({
        name: user.name,
        balance: user.balance,
    });
    const [error, setError] = useState('');
    const [isFormReady, setIsFormReady] = useState(false);
    const { authData } = useContext(AuthContext);
    const [activeBets, setActiveBets] = useState([]);
    const [historyBets, setHistoryBets] = useState([]);

    useEffect(() => {
        fetchBets();
    }, []);

    const fetchBets = () => {
        axios.get(`http://localhost:8080/bet?active=1&email=${user.email}`,
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(r => {
                setActiveBets(r.data);
                console.log(r.data);
            }).catch(err => {
                if (err && err.response) {
                    setError(err.response.data.error);
                }
            });
        axios.get(`http://localhost:8080/bet?active=0&email=${user.email}`,
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(r => {
                setHistoryBets(r.data);
                console.log(r.data);
            }).catch(err => {
                if (err && err.response) {
                    setError(err.response.data.error);
                }
            });
    }

    useEffect(() => {
        const formValues = Object.values(form);
        const isFilled = formValues.every(value => value !== '' && value !== null);

        if(form.balance < 0) {
            setError('Balance should be more or equal 0');
            setIsFormReady(false);
            return;
        } else {
            setError('');
        }

        setIsFormReady(isFilled);
    }, [form]);

    const changeField = (e, field) => {
        setForm({
            ...form,
            [field]: e.target.value,
        });
    };


    const handleSubmit = () => {
        axios.post('http://localhost:8080/users/update', {
            id: user.id,
            name: form.name,
            balance: parseFloat(form.balance),
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
            if (err && err.response) {
                setError(err.response.data.error);
            }
        });
    }

    const handleReturn = (id) => {
        axios.post('http://localhost:8080/bet/return', {
            id: id
        },
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(() => {
            setError('');
            close();
        }).catch(err => {
            if (err && err.response) {
                setError(err.response.data.error);
            }
        });
    }

    const handleBanClick = () => {
        const action = user.is_locked ? 'unban' : 'ban';
        axios.post('http://localhost:8080/users/' + action, {
            id: user.id
        },
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(() => {
            setError('');
            close();
        }).catch(err => {
            if (err && err.response) {
                setError(err.response.data.error);
            }
        });
    }

    return (
        <div style={{width: "60vw"}}>
            <div className="Modal-Error">
                {error}
            </div>
            <div>
                <p>ID: {user.id}</p>
            </div>
            <div>
                <p>Email: {user.email}</p>
            </div>
            <div>
                <p>Name:
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => changeField(e, 'name')}
                        style={{width: "150px"}}
                    />
                </p>
            </div>
            <div>
                <p>Role: {user.role.name}</p>
            </div>
            <div style={{display: "flex", alignItems: "center"}}>
                <p style={{marginRight:"20px"}}>Banned: {user.is_locked ? 'Yes' : 'No'}</p>
                <button onClick={handleBanClick} className='Button'>{user.is_locked ? 'Unban' : 'Ban'}</button>
            </div>
            <div>
                <p>Balance:
                    <input
                        type="number"
                        value={form.balance}
                        onChange={(e) => changeField(e, 'balance')}
                        style={{width: "150px"}}
                    />
                    €
                </p>
            </div>

            <button
                style={{ marginTop: "20px"}}
                className={`Button Modal-button ${isFormReady ? '' : 'Button_disabled'}`}
                onClick={handleSubmit}
                disabled={!isFormReady}
            >
                Update
            </button>

            <div style={{display: "flex", flexDirection: "row", marginTop: '20px', justifyContent:"space-between"}}>
                <p style={{width: "5%"}}>ID</p>
                <p style={{width: "15%"}}>Game</p>
                <p style={{width: "10%"}}>Selected Team</p>
                <p style={{width: "10%"}}>Odd</p>
                <p style={{width: "10%"}}>Bet</p>
                <p style={{width: "15%"}}>Game finish date</p>
                <p style={{width: "15%"}}>Action</p>
            </div>
            <div style={{height: "200px", border: "1px solid white", marginTop: "20px", borderRadius: "15px", overflowY: "auto"}}>
                {activeBets && activeBets.length > 0 && activeBets.map(bet =>
                    <div style={{display: "flex", flexDirection: "row", justifyContent:"space-between", marginBottom:"10px", alignItems: "center", padding: "10px"}}>
                        <p style={{width: "5%"}}>{bet.id}</p>
                        <p style={{width: "15%"}}>{bet.game.teamGame1.team.name} vs {bet.game.teamGame2.team.name}</p>
                        <p style={{width: "10%"}} className='fw-800'>{bet.selectedTeam === 'team1' ? bet.game.teamGame1.team.name : bet.game.teamGame2.team.name}</p>
                        <p style={{width: "10%"}} className='fw-800'>x{bet.selectedTeam === 'team1' ? bet.game.teamGame1.coefficient : bet.game.teamGame2.coefficient}</p>
                        <p style={{width: "10%"}}>{bet.amount}€</p>
                        <p style={{width: "15%"}}>{formatGameDate(bet.game.game_finish_date)}</p>
                        {bet.is_returned ? (
                            <p>RETURNED</p>
                        ) : (
                            <button onClick={() => handleReturn(bet.id)} className='Button' style={{width: "15%"}}>Return</button>
                        )}
                    </div>
                )}
            </div>

            <div style={{display: "flex", flexDirection: "row", marginTop: '20px', justifyContent:"space-between"}}>
                <p style={{width: "5%"}}>ID</p>
                <p style={{width: "15%"}}>Game</p>
                <p style={{width: "10%"}}>Selected Team</p>
                <p style={{width: "10%"}}>Odd</p>
                <p style={{width: "10%"}}>Bet</p>
                <p style={{width: "10%"}}>Result</p>
                <p style={{width: "15%"}}>Game finish date</p>
                <p style={{width: "15%"}}>Action</p>
            </div>
            <div style={{height: "200px", border: "1px solid white", marginTop: "20px", borderRadius: "15px", overflowY: "auto"}}>
                {historyBets && historyBets.length > 0 && historyBets.map(bet =>
                    <div style={{display: "flex", flexDirection: "row", justifyContent:"space-between", marginBottom:"10px", alignItems: "center", padding: "10px"}}>
                        <p style={{width: "5%"}}>{bet.id}</p>
                        <p style={{width: "15%"}}>{bet.game.teamGame1.team.name} vs {bet.game.teamGame2.team.name}</p>
                        <p style={{width: "10%"}} className='fw-800'>{bet.selectedTeam === 'team1' ? bet.game.teamGame1.team.name : bet.game.teamGame2.team.name}</p>
                        <p style={{width: "10%"}} className='fw-800'>x{bet.selectedTeam === 'team1' ? bet.game.teamGame1.coefficient : bet.game.teamGame2.coefficient}</p>
                        <p style={{width: "10%"}}>{bet.amount}€</p>
                        <p style={{width: "10%"}}>
                            <span style={bet.game.team_won === bet.selectedTeam ? {color: "#40e00f"} : {color: "#ff4c3f"}}>
                                {bet.game.team_won === bet.selectedTeam ? (
                                    '+'
                                ) : (
                                    '-'
                                )}
                                <span className="fw-800" style={bet.game.team_won === bet.selectedTeam ? {color: "#40e00f"} : {color: "#ff4c3f"}}>
                                    {bet.game.team_won === bet.selectedTeam ? (
                                        bet.selectedTeam === 'team1' ? (
                                            format2Num(bet.amount * bet.game.teamGame1.coefficient)
                                        ) : (
                                            format2Num(bet.amount * bet.game.teamGame2.coefficient)
                                        )
                                    ) : (
                                        bet.amount
                                    )}
                                </span>
                                €
                            </span>
                        </p>
                        <p style={{width: "15%"}}>{formatGameDate(bet.game.game_finish_date)}</p>
                        {bet.is_returned ? (
                            <p>RETURNED</p>
                        ) : (
                            <button onClick={() => handleReturn(bet.id)} className='Button' style={{width: "15%"}}>Return</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUsersDetails;