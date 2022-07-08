import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ isModalOpen, setShowModal, children }) {
  const closeModal = useCallback(() => {
    setShowModal();
  }, [setShowModal]);

  const onBackdropClose = useCallback(
    evt => {
      if (evt.target === evt.currentTarget) {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    const handleKeyDown = evt => {
      if (evt.code === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('modal-is-open');
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-is-open');
    };
  }, [closeModal, isModalOpen]);

  return createPortal(
    <div className={s.overlay} onClick={onBackdropClose}>
      <div className={s.modal}>{children}</div>
    </div>,
    modalRoot
  );
}

Modal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};
