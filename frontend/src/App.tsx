import type { JSX } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout/Layout';
import { APIProvider } from './provider/APIProvider';
import { Guilds } from './sections/Guilds/Guilds';
import { Guild } from './sections/Guild/Guild';
import { LogEntries } from './sections/Logs/LogEntries';

export const App = function App(): JSX.Element {
  return (
    <APIProvider>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Guilds />} />
            <Route path="/guild/:id" element={<Guild />} />
            <Route path="/logs" element={<LogEntries />} />
          </Routes>
        </BrowserRouter>
      </Layout>
    </APIProvider>
  );
};
