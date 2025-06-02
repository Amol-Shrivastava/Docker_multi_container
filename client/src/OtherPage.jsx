import React from 'react';
import { Link } from 'react-router-dom'

const OtherPage = () => {
  return (
    <div>
        I am  some other Page.
        <Link to='/'> Go back to Home. </Link>
    </div>
  )
}

export default OtherPage