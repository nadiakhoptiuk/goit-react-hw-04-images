import React from 'react';
import s from './ErrorView.module.css';

export default function ErrorView() {
  return (
    <p className={s.errorMessage}>No images were found for your request...</p>
  );
}
