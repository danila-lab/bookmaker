import React, {useContext, useEffect, useState} from 'react';
import './BetsPanel.scss';
import {AuthContext} from "../../App";
import axios from "axios";
import Modal from "../Modal/Modal";
import MyBets from "../MyBets/MyBets";

const BetsPanel = ({bet, close}) => {
    const { authData, setIsLoginOpen, updateAuthData } = useContext(AuthContext);
    const [amount, setAmount] = useState(5);
    const [error, setError] = useState(null);
    const [isMyBetsOpen, setIsMyBetsOpen] = useState(false);

    useEffect(() => {
        console.log(bet);
        setError(null);
        if(bet && !bet.is_bets_open) {
            setError('Bets is closed')
        }

    }, [bet])

    const handleAmountChange = (e) => {
        const a = e.target.value;
        setAmount(a);
    }

    const handlePlaceBet = () => {
        if(!authData.id) {
            setIsLoginOpen(true);
            return;
        }

        if(amount <= 0) {
            setError("Amount should be more than 0");
            return;
        }

        const selectedTeam = bet.selectedTeam.id === bet.teamGame1.id ? 'team1' : 'team2';

        axios.post("http://localhost:8080/bet", {
                game_id: bet.id,
                selected_team: selectedTeam,
                amount: format2Num(amount),
            },
            {
                headers: {
                    'Authorization': `Bearer ${authData.jwt}`,
                },
        }).then((r) => {
            updateAuthData({
                ...authData,
                balance: format2Num(r.data.user.balance),
            });
            close();
        }).catch((err) => {
            axios.get('http://localhost:8080/users/info?id=' + authData.id, {
                headers: {
                    'Authorization': `Bearer ${authData.jwt}`,
                }
            })
                .then(r => {
                    updateAuthData({
                        ...authData,
                        balance: r.data.balance,
                    });
                }).catch(err => {
                    console.log(err)
            })
            console.log(err.response.data.error);
            setError(err.response.data.error);
        });
    }

    const format2Num = (num) => {
        if (num) {
            const n = parseFloat(num);
            if (!isNaN(n)) {
                return parseFloat(n.toFixed(2));
            }
        }
        return null;
    }

    const closeMyBets = () => {
        setIsMyBetsOpen(false);
    }

    const openMyBets = () => {
        if(!authData.id) {
            setIsLoginOpen(true);
            return;
        }

        setIsMyBetsOpen(true);
    }

    return (
        <div className="BetsPanel">
            <Modal isOpen={isMyBetsOpen} close={closeMyBets} content={<MyBets close={closeMyBets} />} />
            <div className="BetsPanel-Header">
                <button className="Button_secondary BetsPanel-Header-Button">Ticket</button>
                <button onClick={openMyBets} className="Button_secondary BetsPanel-Header-Button">My bets</button>
            </div>
            <div className="BetsPanel-Content">
                {!bet
                    ?
                    <h1>Please select bet</h1>
                    :
                    <div>
                        <div className="BetsPanel-Content-Info">
                            <p style={{textAlign: "center", marginBottom: "20px"}}>
                                <span className="fw-700">{bet.teamGame1.team.name} </span>
                                vs
                                <span className="fw-700"> {bet.teamGame2.team.name}</span>
                            </p>
                            <p>
                                Selected team:
                                <span className="fw-700"> {bet.selectedTeam.team.name}</span>
                            </p>
                            <p>
                                Odd:
                                <span className="fw-700"> x{bet.selectedTeam.coefficient}</span>
                            </p>


                        </div>

                        <div className="BetsPanel-Content-Bet">
                            {authData.id &&
                                <p>Current balance: <span
                                    className="fw-700">
                                    {/* {format2Num(authData.balance-0.01 < 0 ? 0.00 : authData.balance-0.01)} */}
                                    {authData.balance}
                                </span>€</p>
                            }
                            <input
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="Amount"
                            />

                            <p>
                                Possible winnings:
                                <span className="fw-700"> {format2Num(amount * bet.selectedTeam.coefficient)}</span>
                            </p>

                            <p className="BetsPanel-Content-Bet-Error">{error}</p>

                            <button onClick={handlePlaceBet} className={`${bet.is_bets_open ? 'Button' : 'Button_disabled'} BetsPanel-Content-Bet-Button`}disabled={!bet.is_bets_open}>PLACE BET</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default BetsPanel;