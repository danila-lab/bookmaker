import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import { AuthContext } from '../../App';

export const AdminGamesCreate = ({ close }) => {
    const [form, setForm] = useState({
        team_name_1: '',
        coefficient_1: 1,
        team_name_2: '',
        coefficient_2: 1,
        game_type: '',
        game_start_date: '',
        game_finish_date: '',
        category_name: '',
    });
    const [error, setError] = useState('');
    const [isFormReady, setIsFormReady] = useState(false);
    const { authData } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchTeams();
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

    const fetchTeams = () => {
        axios.get('http://localhost:8080/team/')
            .then(r => {
                setTeams(r.data);
                console.log(r.data);
            }).catch(err => {
                console.log(err);
        });
    };

    const fetchCategories = () => {
        axios.get('http://localhost:8080/categories')
            .then(r => {
                setCategories(r.data);
            }).catch(err => {
            console.log(err);
        });
    };

    const handleSubmit = () => {
        console.log(form);
        axios.post('http://localhost:8080/game', {
            team_name_1: form.team_name_1,
            coefficient_1: parseFloat(form.coefficient_1),
            team_name_2: form.team_name_2,
            coefficient_2: parseFloat(form.coefficient_2),
            game_type: form.game_type,
            game_start_date: form.game_start_date,
            game_finish_date: form.game_finish_date,
            category_name: form.category_name,
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

    return (
        <div>
            <div className="Modal-Error">
                {error}
            </div>
            <div className="Modal-input">
                <select className="Select_secondary" style={{ width: "200px", height: "60px"}} onChange={(e) => changeField(e, 'team_name_1')}>
                    <option value="" disabled selected>Team 1</option>
                    {teams.length > 0 && teams.map(team =>
                        <option value={team.name}>{team.name}</option>
                    )}
                </select>
                <input
                    style={{ marginLeft: "20px"}}
                    type="number"
                    placeholder="Odd 1"
                    value={form.coefficient_1}
                    onChange={(e) => changeField(e, 'coefficient_1')}
                />
            </div>
            <div className="Modal-input">
            <select className="Select_secondary" style={{ width: "200px", height: "60px"}} onChange={(e) => changeField(e, 'team_name_2')}>
                    <option value="" disabled selected>Team 2</option>
                    {teams.length > 0 && teams.map(team =>
                        <option value={team.name}>{team.name}</option>
                    )}
                </select>
                <input
                    style={{ marginLeft: "20px"}}
                    type="number"
                    placeholder="Odd 2"
                    value={form.coefficient_2}
                    onChange={(e) => changeField(e, 'coefficient_2')}
                />
            </div>

            Game start date:
            <div className="Modal-input">
                <input
                    type="datetime-local"
                    placeholder="Game start date"
                    value={form.game_start_date}
                    onChange={(e) => changeField(e, 'game_start_date')}
                />
            </div>

            Game finish date:
            <div className="Modal-input">
                <input
                    type="datetime-local"
                    placeholder="Game finish date"
                    value={form.game_finish_date}
                    onChange={(e) => changeField(e, 'game_finish_date')}
                />
            </div>

            <div className="Modal-input">
                <select className="Select_secondary" style={{ width: "200px", height: "40px"}} onChange={(e) => changeField(e, 'game_type')}>
                    <option value="" disabled selected>Game Type</option>
                    <option value="manual">Live</option>
                    <option value="auto">Prematch</option>
                </select>
            </div>

            <div className="Modal-input">
                <select className="Select_secondary" style={{ width: "200px", height: "40px"}} onChange={(e) => changeField(e, 'category_name')}>
                    <option value="" disabled selected>Category</option>
                    {categories.length > 0 && categories.map(category =>
                        <option value={category.name}>{category.name}</option>
                    )}
                </select>
            </div>

            <button
                className={`Button Modal-button ${isFormReady ? '' : 'Button_disabled'}`}
                onClick={handleSubmit}
                disabled={!isFormReady}
            >
                Create
            </button>
        </div>
    );
}

export default AdminGamesCreate;