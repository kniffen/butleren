import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './Layout/Layout'
import { APIProvider } from './provider/APIProvider'
import { Guilds } from './sections/Guilds/Guilds'
import { Guild } from './sections/Guild/Guild'

export const App = function App() {
  return (
    <APIProvider>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Guilds />} />
            <Route path="/guild/:id" element={<Guild />} />
          </Routes>
        </BrowserRouter>
      </Layout>
    </APIProvider>
  )
}
