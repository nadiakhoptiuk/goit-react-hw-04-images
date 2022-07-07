import React from 'react';
import PropTypes from 'prop-types';
import Container from '../Container';
import s from './Section.module.css';

export default function Section({ title, children }) {
  return (
    <section className={s.section}>
      <Container>
        <h1 className={title ? s.title : s.hidden}>{title}</h1>
        {children}
      </Container>
    </section>
  );
}

Section.propTypes = {
  title: PropTypes.string,
};
