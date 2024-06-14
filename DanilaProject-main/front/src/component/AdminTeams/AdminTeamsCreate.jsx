import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import { AuthContext } from '../../App';
import { handleDeleteImage, handleSaveImage } from '../../util/filesApi';

export const AdminTeamsCreate = ({ close, team }) => {
    const [form, setForm] = useState({
        name: '',
    });
    const [error, setError] = useState('');
    const [isFormReady, setIsFormReady] = useState(false);
    const { authData } = useContext(AuthContext);
    const [img, setImg] = useState(null);

    useEffect(() => {
        setForm({
            name: team?.name,
        });
        setImg(null);
    }, [team])

    useEffect(() => {
        if(form.name) {
            setIsFormReady(true);
        } else {
            setIsFormReady(false);
        }
    }, [form]);

    const uploadImage = (e) => {
        const file = e.target.files[0];
        setImg(file);
    }

    const changeName = (e) => {
        const name = e.target.value;
        setForm({
            ...form,
            name: name,
        });
    }

    const handleSubmit = async () => {
        if (team?.name) {
            handleEdit();
        } else {
            handleCreate();
        }
    }

    const handleEdit = async () => {
        let newImg;
        if (team?.img && img) {
            handleDeleteImage(team.img);
        }

        if (img) {
            newImg = await handleSaveImage(img);
            console.log(newImg)
        }

        axios.post('http://localhost:8080/team/edit', {
            id: team.id,
            name: form.name,
            image: newImg,
        },
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(r => {
                console.log(r.data);
                setImg(null);
                setForm({
                    name: '',
                });
                setError('');
                close();
            }).catch(err => {
                if (err && err.response) {
                    setError(err.response.data.error);
                }
            });
    }

    const handleCreate = async () => {
        const path = await handleSaveImage(img);
        console.log(path)
        axios.post('http://localhost:8080/team', {
            name: form.name,
            image: path,
        },
        {
            headers: {
                'Authorization': `Bearer ${authData.jwt}`,
            },
        }).then(r => {
                console.log(r.data);
                setImg(null);
                setForm({
                    name: '',
                });
                setError('');
                close();
            }).catch(err => {
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
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={changeName}
                />
            </div>

            <div style={{marginBottom: "20px"}}>
                <input type="file" name="avatar" accept="image/*" onChange={uploadImage} />
            </div>

            <button
                className={`Button Modal-button ${isFormReady ? '' : 'Button_disabled'}`}
                onClick={handleSubmit}
                disabled={!isFormReady}
            >
                {team?.name ? 'Edit' : 'Create'}
            </button>
        </div>
    );
}

export default AdminTeamsCreate;