import React from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { MutatingDots } from 'react-loader-spinner';
import s from './PendingView.module.css';

export default function PendingView() {
  return (
    <div className={s.loaderWrapper}>
      <MutatingDots aria-label="loading indicator" />
    </div>
  );
}
