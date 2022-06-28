import React from 'react';
import { NavLink } from 'react-router-dom';

const Logo = ({ variant = 'white' }) => (
  <div className="p-text-center">
    <NavLink to="/">
      <div className="p-d-flex p-ai-center">
        <h1 style={{ color: 'black', textAlign: 'left' }}>
          dataSCRIBE
          <small className="p-d-block">ALPHA</small>
        </h1>
      </div>
    </NavLink>
  </div>
);

export default Logo;
