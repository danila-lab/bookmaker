import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import { AuthContext } from '../../App';

export const AdminCategoriesCreate = ({ close, category }) => {
    const [form, setForm] = useState({
        name: '',
        channel_stream: '',
    });
    const [error, setError] = useState('');
    const [isFormReady, setIsFormReady] = useState(false);
    const { authData } = useContext(AuthContext);
    const [img, setImg] = useState(null);

    useEffect(() => {
        setForm({
            name: category?.name,
            channel_stream: category?.channel_stream,
        });
        setImg(null);
    }, [category])

    const uploadImage = (e) => {
        const file = e.target.files[0];
        setImg(file);
    }

    const handleSaveImage = async () => {
        const formData = new FormData();
        formData.append('image', img);

        try {
            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleDeleteImage = async (path) => {
        try {
            await axios.post('http://localhost:8080/deleteImg', {
                path: path,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if(form.name) {
            setIsFormReady(true);
        } else {
            setIsFormReady(false);
        }
    }, [form]);

    const changeName = (e) => {
        const name = e.target.value;
        setForm({
            ...form,
            name: name,
        });
    }

    const changeChannel = (e) => {
        const channel_stream = e.target.value;
        setForm({
            ...form,
            channel_stream: channel_stream,
        });
    }

    const handleCreate = async () => {
        const path = await handleSaveImage();
        axios.post('http://localhost:8080/categories', {
            name: form.name,
            channel_stream: form.channel_stream,
            image: path,
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

    const handleEdit = async () => {
        let newImg;
        if (category?.img && img) {
            handleDeleteImage(category.img);
        }

        if (img) {
            newImg = await handleSaveImage(img);
            console.log(newImg)
        }

        axios.post('http://localhost:8080/categories/edit', {
            id: category.id,
            name: form.name,
            channel_stream: form.channel_stream,
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
                    channel_stream: '',
                });
                setError('');
                close();
            }).catch(err => {
                if (err && err.response) {
                    setError(err.response.data.error);
                }
            });
    }

    const handleSubmit = async () => {
        if (category?.name) {
            handleEdit();
        } else {
            handleCreate();
        }
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

            <div className="Modal-input">
                <input
                    type="text"
                    placeholder="Twitch channel"
                    value={form.channel_stream}
                    onChange={changeChannel}
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
                {category?.name ? 'Edit' : 'Create'}
            </button>
        </div>
    );
}

export default AdminCategoriesCreate;