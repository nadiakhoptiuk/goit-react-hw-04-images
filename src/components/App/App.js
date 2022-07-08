import React, { useState } from 'react';
import ImageGallery from 'components/ImageGallery';
import Searchbar from 'components/Searchbar';
import Section from 'components/Section';
import Modal from 'components/Modal';
import s from './App.module.css';

export default function App() {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [openedImage, setOpenedImage] = useState({});

  const handleFormSubmit = enteredPhrase => {
    if (enteredPhrase.trim() === '') {
      return;
    }

    setSearchPhrase(enteredPhrase.trim());
  };

  const createModal = selectedImage => {
    setOpenedImage(selectedImage);
    toggleModal();
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Searchbar onFormSubmit={handleFormSubmit} />
      <main>
        <Section>
          <ImageGallery
            searchPhrase={searchPhrase}
            onImageClick={createModal}
          />
        </Section>
      </main>
      {showModal && (
        <Modal onModalClose={toggleModal}>
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
