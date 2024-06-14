import React from 'react';
import './Modal.scss';

const Modal = ({isOpen, close, content}) => {
    const body = document.body;

    if(!isOpen) {
        body.classList.remove('body-lock');
        return null;
    } else {
        body.classList.add('body-lock');
    }

    const stopPropagation = (e) => {
        e.stopPropagation()
    }

    return (
        <div className="ModalWrapper" onClick={close}>
            <div className="Modal" onClick={stopPropagation}>
                <button className="Modal-Close" onClick={close} />
                {content}
            </div>
        </div>
    );
};

export default Modal;