import React from 'react';
import PropTypes from 'prop-types';
import SearchForm from 'components/SearchForm';
import s from './Searchbar.module.css';

export default function Searchbar({ onFormSubmit }) {
  return (
    <header className={s.searchbar}>
      <SearchForm onFormSubmit={onFormSubmit} />
    </header>
  );
}

Searchbar.propTypes = { onFormSubmit: PropTypes.func.isRequired };
