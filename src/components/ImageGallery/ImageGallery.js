import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import PendingView from 'components/PendingView';
import ImageGalleryItem from 'components/ImageGalleryItem';
import ErrorView from 'components/ErrorView';
import Button from 'components/Button';
import s from './ImageGallery.module.css';

const STATUS_OPTIONS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

const API_URL = 'https://pixabay.com/api/';
const API_KEY = '27979980-56564682deb2f4cc3aa0cce1c';
const PER_PAGE = 12;

const searchParams = (value, page) =>
  new URLSearchParams({
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    q: value.trim(),
    per_page: PER_PAGE,
    page: page,
  });

export default function ImageGallery({
  searchPhrase,
  getSelectedImage,
  page,
  setPage,
}) {
  const [status, setStatus] = useState(STATUS_OPTIONS.IDLE);
  const [images, setImages] = useState([]);
  const [countOfPages, setCountOfPages] = useState(null);

  const fetchImages = useCallback(() => {
    if (searchPhrase === '') {
      return;
    }
    setStatus(STATUS_OPTIONS.PENDING);

    fetch(`${API_URL}?&${searchParams(searchPhrase, page)}`)
      .then(res => res.json())
      .then(res => {
        const arrayOfImages = res.hits;

        if (arrayOfImages.length === 0) {
          throw new Error();
        }

        const countOfPages = getCountOfPages(res);
        setCountOfPages(countOfPages);
        return arrayOfImages;
      })
      .then(handleFetchResult)
      .then(newImages => {
        page > 1
          ? setImages(prevState => [...prevState, ...newImages])
          : setImages(newImages);
        setStatus(STATUS_OPTIONS.RESOLVED);
      })
      .then(() => {
        if (page === 1) {
          window.scrollTo(0, 0);
        }
      })
      .catch(error => {
        setImages([]);
        setCountOfPages(null);
        setStatus(STATUS_OPTIONS.REJECTED);
      });
  }, [page, searchPhrase]);

  const handleFetchResult = result => {
    const newImages = result.map(
      ({ id, webformatURL, largeImageURL, tags }) => {
        return { id, webformatURL, largeImageURL, tags };
      }
    );

    return newImages;
  };

  const handleLoadMoreClick = evt => {
    setPage(page + 1);
  };

  const handleImageClick = evt => {
    const selectedImage = images.find(
      image => image.id === Number(evt.currentTarget.id)
    );
    getSelectedImage(selectedImage);
  };

  const getCountOfPages = data => {
    const totalImages = data.totalHits;
    return Math.ceil(totalImages / PER_PAGE);
  };

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <>
      <ul className={s.gallery}>
        {images?.map(image => (
          <li
            key={image.id}
            id={image.id}
            onClick={handleImageClick}
            className={s.galleryItem}
          >
            <ImageGalleryItem url={image.webformatURL} alt={image.tags} />
          </li>
        ))}
      </ul>

      {status === STATUS_OPTIONS.RESOLVED && countOfPages > page ? (
        <Button
          title="Load more"
          onLoadMoreClick={handleLoadMoreClick}
        ></Button>
      ) : null}

      {status === STATUS_OPTIONS.PENDING && <PendingView />}
      {status === STATUS_OPTIONS.REJECTED && <ErrorView />}
    </>
  );
}

ImageGallery.propTypes = {
  searchPhrase: PropTypes.string,
  getSelectedImage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};
