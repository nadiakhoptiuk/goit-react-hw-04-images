import React from 'react';
import PropTypes from 'prop-types';
import s from './Button.module.css';

export default function Button({ onLoadMoreClick, title }) {
  return (
    <button type="button" className={s.button} onClick={onLoadMoreClick}>
      {title}
    </button>
  );
}

Button.propTypes = {
  onLoadMoreClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
