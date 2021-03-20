import React from 'react';
import { MDBRow, MDBIcon } from 'mdbreact';

const DocsLink = ({ title, href }) => {
  return (
    <>
      <MDBRow className='align-items-center mt-5'>
        <h4 className='grey-text' style={{ margin: '0px' }}>
          <strong className='font-weight-bold'>{title}</strong>
        </h4>
        <a
          className='border white-text px-2 border-light rounded ml-2 blue-gradient'
          target='_blank'
          href={`${href}/?utm_source=DemoApp&utm_medium=MDBReactPro`}
          rel='noopener noreferrer'
        >
          <MDBIcon icon='graduation-cap' className='mr-2' />
          Docs
        </a>
      </MDBRow>
      <hr className='mb-5' />
    </>
  );
};

export default DocsLink;
