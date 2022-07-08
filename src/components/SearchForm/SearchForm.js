import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BsSearch } from 'react-icons/bs';
import s from './SearchForm.module.css';

export default function SearchForm({ onFormSubmit }) {
  const [enteredPhrase, setEnteredPhrase] = useState('');

  const inputForSearchRef = useRef(null);

  useEffect(() => {
    inputForSearchRef?.current?.focus();
  }, []);

  const handleInputChange = ({ target: { value } }) => {
    const enteredPhrase = value;
    setEnteredPhrase(enteredPhrase);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    onFormSubmit(enteredPhrase);
    formReset();
  };

  const formReset = () => {
    setEnteredPhrase('');
  };

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <button type="submit" className={s.button} aria-label="search button">
        <BsSearch size={20} />
      </button>

      <input
        className={s.input}
        type="text"
        value={enteredPhrase}
        autoComplete="off"
        autoFocus
        placeholder="Search images and photos"
        onChange={handleInputChange}
        ref={inputForSearchRef}
      />
    </form>
  );
}

SearchForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
};
