import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Store from './Store'

import Home from './pages/Home'
import Guild from './pages/Guild'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guild/:guild" element={<Store><Guild /></Store>} />
      </Routes>
    </BrowserRouter>
  )
}
