import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import { Gallery } from './scene/Gallery';
import { useGame } from './state/game';
import './ui/styles.css';

useGame.getState().newToy(); // pick this season's trend

const showGallery = new URLSearchParams(window.location.search).has('gallery');

createRoot(document.getElementById('root')!).render(<StrictMode>{showGallery ? <Gallery /> : <App />}</StrictMode>);
