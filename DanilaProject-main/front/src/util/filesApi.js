import axios from 'axios';

export const handleSaveImage = async (img) => {
    const formData = new FormData();
    formData.append('image', img);

    return axios.post('http://localhost:8080/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(r => {
        console.log(r.data);
        return r.data;
    }).catch(err => {
        console.log(err);
        return null;
    });
}

export const handleDeleteImage = async (path) => {
    return axios.post('http://localhost:8080/deleteImg', {
        path: path,
    }).then(r => {
        console.log(r.data);
        return r.data;
    }).catch(err => {
        console.log(err);
        return null;
    });
}