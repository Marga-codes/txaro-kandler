import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Activa las reglas CSS `.js .reveal`, como hacia el script del sitio original.
document.documentElement.classList.add('js')

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)