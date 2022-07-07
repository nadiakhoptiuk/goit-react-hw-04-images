import React, { useState, useEffect } from 'react';
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
let PAGE = 1;

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

export default function ImageGallery({ searchPhrase, onImageClick }) {
  const [status, setStatus] = useState(STATUS_OPTIONS.IDLE);
  const [images, setImages] = useState([]);
  const [countOfPages, setCountOfPages] = useState(null);

  const fetchImages = async (searchPhrase, page) => {
    if (searchPhrase === '') {
      throw new Error();
    }

    const res = await fetch(`${API_URL}?&${searchParams(searchPhrase, page)}`);
    const parsedRes = await res.json();
    const arrayOfImages = await parsedRes.hits;

    if (arrayOfImages.length === 0) {
      throw new Error();
    }
    const countOfPages = getCountOfPages(parsedRes);
    setCountOfPages(countOfPages);
    return arrayOfImages;
  };

  const handleFetchResult = result => {
    setStatus(STATUS_OPTIONS.RESOLVED);

    const newImages = result.map(
      ({ id, webformatURL, largeImageURL, tags }) => {
        return { id, webformatURL, largeImageURL, tags };
      }
    );
    return newImages;
  };

  const handleLoadMoreClick = async evt => {
    PAGE += 1;

    setStatus(STATUS_OPTIONS.PENDING);
    // const result = await
    fetchImages(searchPhrase, PAGE)
      .then(handleFetchResult)
      .then(newImages => setImages([...images, ...newImages]));
    // const newImages = handleFetchResult(result);
    // setImages([...images, ...newImages]);
  };

  const handleImageClick = evt => {
    const selectedImage = images.find(
      image => image.id === Number(evt.currentTarget.id)
    );
    onImageClick(selectedImage);
  };

  const getCountOfPages = data => {
    const totalImages = data.totalHits;
    return Math.ceil(totalImages / PER_PAGE);
  };

  //не потрібно?
  // componentDidMount() {
  //   this.setState({ status: STATUS_OPTIONS.IDLE });
  // }

  useEffect(() => {
    if (!searchPhrase) {
      return;
    }

    setImages([]);
    setStatus(STATUS_OPTIONS.PENDING);
    PAGE = 1;

    fetchImages(searchPhrase, PAGE)
      .then(handleFetchResult)
      .then(setImages)
      .catch(error => {
        setCountOfPages(null);
        setStatus(STATUS_OPTIONS.REJECTED);
      });
  }, [searchPhrase]);

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

      {status === STATUS_OPTIONS.RESOLVED && countOfPages > PAGE ? (
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
  onImageClick: PropTypes.func.isRequired,
};
