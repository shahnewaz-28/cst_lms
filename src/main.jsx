import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CSTApp from './CSTApp.jsx'

window.storage = {
  get: (key) => Promise.resolve(localStorage.getItem(key) ? { value: localStorage.getItem(key) } : null),
  set: (key, val) => { localStorage.setItem(key, val); return Promise.resolve(); },
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CSTApp />
  </StrictMode>,
)
