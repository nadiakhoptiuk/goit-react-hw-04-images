import React, { useState, useEffect, useCallback } from 'react';
import ImageGallery from 'components/ImageGallery';
import Searchbar from 'components/Searchbar';
import Section from 'components/Section';
import Modal from 'components/Modal';
import s from './App.module.css';

export default function App() {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [openedImage, setOpenedImage] = useState({});
  const [page, setPage] = useState(1);

  const handleFormSubmit = enteredPhrase => {
    if (enteredPhrase.trim() === '') {
      return;
    }

    setSearchPhrase(enteredPhrase.trim());
    setPage(1);
  };

  const getSelectedImage = selectedImage => {
    setOpenedImage(selectedImage);
  };

  const toggleModal = useCallback(() => {
    setShowModal(prevState => !prevState);
  }, []);

  useEffect(() => {
    if (JSON.stringify(openedImage) === '{}') {
      setShowModal(false);
      return;
    }
    toggleModal();
  }, [openedImage, toggleModal]);

  return (
    <>
      <Searchbar onFormSubmit={handleFormSubmit} />
      <main>
        <Section>
          <ImageGallery
            searchPhrase={searchPhrase}
            getSelectedImage={getSelectedImage}
            page={page}
            setPage={setPage}
          />
        </Section>
      </main>
      {showModal && (
        <Modal isModalOpen={showModal} setShowModal={toggleModal}>
          <img
            className={s.modalImage}
            src={openedImage.largeImageURL}
            alt={openedImage.tags}
            width={1280}
          />
        </Modal>
      )}
    </>
  );
}
