import type { JSX } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout/Layout';
import { APIProvider } from './provider/APIProvider';
import { UsersPage } from './pages/UsersPage/UsersPage';
import { LogsPage } from './pages/LogsPage/LogsPage';
import { HomePage } from './pages/HomePage/HomePage';
import { GuildPage } from './pages/GuildPage/GuildPage';

export const App = function App(): JSX.Element {
  return (
    <APIProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/guild/:id" element={<Layout><GuildPage /></Layout>} />
          <Route path="/guild/:id/:content" element={<Layout><GuildPage /></Layout>} />
          <Route path="/users" element={<Layout><UsersPage /></Layout>} />
          <Route path="/logs" element={<Layout><LogsPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </APIProvider>
  );
};
