import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import { Gallery } from './scene/Gallery';
import './ui/styles.css';

const showGallery = new URLSearchParams(window.location.search).has('gallery');

createRoot(document.getElementById('root')!).render(<StrictMode>{showGallery ? <Gallery /> : <App />}</StrictMode>);
