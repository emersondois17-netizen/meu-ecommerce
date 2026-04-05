import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- Importamos o Roteador
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Envolvemos o App com o BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)