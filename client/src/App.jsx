import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Store from './Store'

import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Users from './pages/Users'
import Guild from './pages/Guild'
import Modules from './pages/Modules'
import Commands from './pages/Commands'
import Chat from './pages/Chat'

import Spotify from './pages/Modules/Spotify'
import Twitter from './pages/Modules/Twitter'
import YouTube from './pages/Modules/YouTube'
import Twitch  from './pages/Modules/Twitch'
import Kick    from './pages/Modules/Kick'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Store><Home /></Store>} />
        <Route path="/users" element={<Store><Users /></Store>}/>
        <Route path="/guild/:guild" element={<Store><Guild /></Store>} />
        <Route path="/modules/:guild" element={<Store><Modules /></Store>} />
        <Route path="/modules/:guild/spotify" element={<Store><Spotify /></Store>} />
        <Route path="/modules/:guild/twitter" element={<Store><Twitter /></Store>} />
        <Route path="/modules/:guild/youtube" element={<Store><YouTube /></Store>} />
        <Route path="/modules/:guild/twitch" element={<Store><Twitch /></Store>} />
        <Route path="/modules/:guild/kick" element={<Store><Kick /></Store>} />
        <Route path="/commands/:guild" element={<Store><Commands /></Store>} />
        <Route path="/chat/:guild" element={<Store><Chat /></Store>} />
      </Routes>
    </BrowserRouter>
  )
}
