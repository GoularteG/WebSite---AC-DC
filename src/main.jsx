import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@fontsource/metal-mania/latin-400.css';
import './styles/global.css';
import './styles/book.css';
import './styles/book-usability.css';
import './styles/inferno.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);

import './styles/trunk.css';
