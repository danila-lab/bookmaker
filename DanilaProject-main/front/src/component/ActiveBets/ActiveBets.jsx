import {formatGameDate} from "../../util/format";

const ActiveBets = ({ bets }) => {

    return (
        <div className="MyBets-Content" >
            {bets && bets.length > 0 &&
                bets.map(bet =>
                    <div
                        className="MyBets-Content-Bet"
                        style={bet.is_returned ? { backgroundColor: "#5e5d5d" } : {}}
                        key={bet.id}
                    >
                        <div className="MyBets-Content-Bet-Header">
                            <p>ID: {bet.id}</p>
                            <p>Start: {formatGameDate(bet.game.game_start_date)}</p>
                        </div>

                        <div className="MyBets-Content-Bet-Content">
                            <div className="MyBets-Content-Bet-Content-Game">
                                <p>{bet.game.teamGame1.team.name}</p>
                                <p>{bet.game.teamGame2.team.name}</p>
                            </div>

                            <div className="MyBets-Content-Bet-Content-Bet">
                                <p className="fw-800">
                                    {bet.selectedTeam === 'team1' ? bet.game.teamGame1.team.name : bet.game.teamGame2.team.name}
                                </p>
                                <p>Odd: <span
                                    className="fw-800">x{bet.selectedTeam === 'team1' ? bet.game.teamGame1.coefficient : bet.game.teamGame2.coefficient}</span>
                                </p>
                            </div>

                            <div className="MyBets-Content-Bet-Content-Amount" style={bet.is_returned ? {display: "flex", flexDirection: "column"} : {}}>
                                <p>Bet: <span className="fw-800">{bet.amount}</span>€</p>
                                {bet.is_returned && <p className="fw-800" style={{color: "yellow"}}>RETURNED</p>}
                            </div>
                        </div>

                    </div>
                )
            }
        </div>
    );
}

export default ActiveBets;