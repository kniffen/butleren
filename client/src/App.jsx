import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Store from './Store'

import Home from './pages/Home'
import Guild from './pages/Guild'
import Modules from './pages/Modules'
import Commands from './pages/Commands'

import Spotify from './pages/Modules/Spotify'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guild/:guild" element={<Store><Guild /></Store>} />
        <Route path="/modules/:guild" element={<Store><Modules /></Store>} />
        <Route path="/modules/:guild/spotify" element={<Store><Spotify /></Store>} />
        <Route path="/commands/:guild" element={<Store><Commands /></Store>} />
      </Routes>
    </BrowserRouter>
  )
}
