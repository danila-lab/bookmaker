import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import { AuthContext } from '../../App';
import { convertDate, format2Num, formatGameDate } from '../../util/format';
import './AdminGamesDetails.scss';

export const AdminGamesDetails = ({ close, game }) => {
    const [form, setForm] = useState({
        coefficient_1: game.teamGame1.coefficient,
        coefficient_2: game.teamGame2.coefficient,
        game_start_date: formatDateForInput(game.game_start_date),
        game_finish_date: formatDateForInput(game.game_finish_date),
    });
    const [error, setError] = useState('');
    const [isFormReady, setIsFormReady] = useState(false);
    const { authData } = useContext(AuthContext);
    const [gameInfo, setGameInfo] = useState({});

    function formatDateForInput(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    useEffect(() => {
        fetchGame();
    }, []);

    useEffect(() => {
        const formValues = Object.values(form);
        const isFilled = formValues.every(value => value !== '' && value !== null);

        if(form.coefficient_1 <= 1 || form.coefficient_2 <= 1) {
            setError('Coefficient should be greater than 1');
            setIsFormReady(false);
            return;
        } else {
            setError('');
        }

        setIsFormReady(isFilled);
    }, [form]);

    useEffect(() => {
        console.log(isFormReady);
    }, [isFormReady]);

    const fetchGame = () => {
        axios.get('http://localhost:8080/game/info?id=' + game.id)
            .then(r => {
                setGameInfo(r.data);
                console.log(r.data);
                setForm({
                    ...form,
                    coefficient_1: r.data.teamGame1.coefficient,
                    coefficient_2: r.data.teamGame2.coefficient,
                })
            }).catch(err => {
            console.log(err);
        });
    };

    const handleSubmit = () => {
        console.log(form);
        axios.post('http://localhost:8080/game/update', {
            id: gameInfo.id,
            coefficient_1: parseFloat(form.coefficient_1),
            coefficient_2: parseFloat(form.coefficient_2),
            game_start_date: form.game_start_date,
            // game_start_date: convertDate(form.game_start_date),
            game_finish_date: form.game_finish_date,
            // game_finish_date: convertDate(form.game_finish_date),
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

    const changeField = (e, field) => {
        setForm({
            ...form,
            [field]: e.target.value,
        });
    };

    const handleClickBets = (e) => {
        e.preventDefault();
        e.stopPropagation();
        axios.post('http://localhost:8080/game/changebetsstatus', {
            id: gameInfo.id,
            is_bets_open: !gameInfo.is_bets_open,
        },
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
    }).then(r => {
            setError('');
            fetchGame();
        }).catch(err => {
            if (err && err.response) {
                setError(err.response.data.error);
            }
        });
    }

    const handleReturnAll = () => {
        axios.post('http://localhost:8080/bet/returnbygame', {
            id: gameInfo.id,
        },
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
    }).then(r => {
            setError('');
            fetchGame();
        }).catch(err => {
            if (err && err.response) {
                setError(err.response.data.error);
            }
        });
    }

    return (
        <div className="AdminGamesDetails">
            <div className="AdminGamesDetails-Left">
                <div className="Modal-Error">
                    {error}
                </div>
                <div className="Modal-input" style={{display:"flex", flexDirection: "row", alignItems: "center"}}>
                    <p>{game.teamGame1.team.name}:&nbsp;</p>
                    {game.type === 'manual' && game.is_active ? (
                        <input
                            style={{ marginLeft: "20px"}}
                            type="number"
                            placeholder="Odd 1"
                            value={form.coefficient_1}
                            onChange={(e) => changeField(e, 'coefficient_1')}
                        />
                    ) : (
                        <p> <span className='fw-800'> x{game.teamGame1.coefficient}</span></p>
                    )}
                </div>
                <div className="Modal-input" style={{display:"flex", flexDirection: "row", alignItems: "center"}}>
                    <p>{game.teamGame2.team.name}:&nbsp;</p>
                    {game.type === 'manual' && game.is_active ? (
                        <input
                            style={{ marginLeft: "20px"}}
                            type="number"
                            placeholder="Odd 2"
                            value={form.coefficient_2}
                            onChange={(e) => changeField(e, 'coefficient_2')}
                        />
                    ) : (
                        <p> <span className='fw-800'> x{game.teamGame2.coefficient}</span></p>
                    )}
                </div>

                Game start date:
                <div className="Modal-input">
                    {gameInfo.is_active ? (
                        <input
                        type="datetime-local"
                        placeholder="Game start date"
                        value={form.game_start_date}
                        onChange={(e) => changeField(e, 'game_start_date')}
                    />
                    ) : (
                        <p>{formatGameDate(form.game_start_date)}</p>
                    )}
                </div>

                Game finish date:
                <div className="Modal-input">
                    {gameInfo.is_active ? (
                        <input
                        type="datetime-local"
                        placeholder="Game finish date"
                        value={form.game_finish_date}
                        onChange={(e) => changeField(e, 'game_finish_date')}
                    />
                    ) : (
                        <p>{formatGameDate(form.game_finish_date)}</p>
                    )}
                </div>

                <div className="Modal-input">
                    <p>Is Game Active: <span className='fw-800'>{gameInfo.is_active === true ? 'Yes' : 'No'}</span></p>
                </div>

                <div className="Modal-input">
                    <p>Is Bets Open: <span className='fw-800'>{gameInfo.is_bets_open === true ? 'Yes' : 'No'}</span></p>
                </div>

                <div className="Modal-input">
                    <p>Game type: <span className='fw-800'>{game.type === 'manual' ? 'Live' : 'Prematch'}</span></p>
                </div>

                <div className="Modal-input">
                    <p>Category: <span className='fw-800'>{game.category.name}</span></p>
                </div>

                <div style={{display: "flex", flexDirection: "row", marginBottom: '20px'}}>
                    {game.is_active && (
                        <button
                            className={`Button_secondary Modal-button`}
                            onClick={handleClickBets}
                            style={{marginRight: '10px'}}
                        >
                            {gameInfo.is_bets_open === false ? 'Open Bets' : 'Close bets'}
                        </button>
                    )}
                    <button
                        className={`Button_secondary Modal-button`}
                        onClick={handleReturnAll}
                        disabled={!isFormReady}
                        style={{marginLeft: '10px'}}
                    >
                        Return all bets
                    </button>
                </div>

                {game.is_active && (
                <button
                    className={`Button Modal-button ${isFormReady ? '' : 'Button_disabled'}`}
                    onClick={handleSubmit}
                    disabled={!isFormReady}
                >
                    Save
                </button>
                )}
            </div>

            <div className="AdminGamesDetails-Right">
                <div>
                    <p>Total bets amount: {format2Num(gameInfo.totalAmount)}€</p>
                </div>

                <div style={{marginTop: '20px'}}>
                    <p>{game.teamGame1.team.name}: {format2Num(gameInfo.totalTeam1Amount)}€ ({format2Num(gameInfo.totalTeam1Amount / gameInfo.totalAmount * 100)}%)</p>
                </div>

                <div>
                    <p>{game.teamGame2.team.name}: {format2Num(gameInfo.totalTeam2Amount)}€ ({format2Num(gameInfo.totalTeam2Amount / gameInfo.totalAmount * 100)}%)</p>
                </div>
                <br />
                <h1 className='fw-800'>{game.teamGame1.team.name}</h1>
                <br />
                <table className="AdminGamesDetails-Right-Bets-Header">
                    <tr>
                        <td>Game ID</td>
                        <td>User ID</td>
                        <td>Email</td>
                        <td>Amount</td>
                    </tr>
                </table>
                <div className="AdminGamesDetails-Right-Bets-Items">
                    {gameInfo.betsTeam1 && gameInfo.betsTeam1.length > 0 && gameInfo.betsTeam1.map(bet =>
                        <div key={bet.id} className="AdminGamesDetails-Right-Bets-Items-Item">
                            <p>{bet.id}</p>
                            <p>{bet.user_id}</p>
                            <p>{bet.user.email}</p>
                            <p>{bet.is_returned ? 'RETURNED' : `${bet.amount}€`}</p>
                        </div>
                    )}
                </div>
                <br />
                <h1 className='fw-800'>{game.teamGame2.team.name}</h1>
                <br />
                <table className="AdminGamesDetails-Right-Bets-Header">
                    <tr>
                        <td>Game ID</td>
                        <td>User ID</td>
                        <td>Email</td>
                        <td>Amount</td>
                    </tr>
                </table>
                <div className="AdminGamesDetails-Right-Bets-Items">
                    {gameInfo.betsTeam2 && gameInfo.betsTeam2.length > 0 && gameInfo.betsTeam2.map(bet =>
                        <div key={bet.id} className="AdminGamesDetails-Right-Bets-Items-Item">
                            <p>{bet.id}</p>
                            <p>{bet.user_id}</p>
                            <p>{bet.user.email}</p>
                            <p>{bet.is_returned ? 'RETURNED' : `${bet.amount}€`}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminGamesDetails;