import { memo, useEffect, useRef, useState, type JSX } from 'react';
import { useAPI } from '../../provider/hooks/useAPI';
import { Card } from '../../components/Card/Card';
import './LogsPage.scss';
import type { LogEntry } from '../../types';

export function LogsPage(): JSX.Element {
  const hasFetchedLogs = useRef(false);
  const { logs } = useAPI();
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [level, setLevel] = useState<string>('all');

  useEffect(() => {
    if (hasFetchedLogs.current) {
      return;
    }

    hasFetchedLogs.current = true;
    logs.getLogs(new Date().toJSON().slice(0, 10)).then(setLogEntries);
  }, [logs]);

  return (
    <>
      <h1>Logs</h1>

      <Card title="Preferences">
        <form className="logs-form">
          <div className="logs-form__item">
            <label htmlFor='log-level'>Log level</label>
            <select id="log-level" onChange={(e) => {
              setLevel(e.target.value);
            }}>
              <option value="all">All</option>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div className="logs-form__item">
            <label htmlFor='sort-order'>Sort</label>
            <select id="sort-order" onChange={() => {
              setLogEntries(prevLogs => prevLogs.slice().reverse());
            }}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="logs-form__item">
            <label htmlFor='log-date'>Date</label>
            <input type="date" id="log-date" defaultValue={new Date().toJSON().slice(0, 10)} onChange={async (e) => {
              const date = e.target.value;
              const logEntries = await logs.getLogs(date);
              setLogEntries(logEntries);
            }}/>
          </div>
        </form>
      </Card>

      <Card title="Log entries" className="logs-entries">
        <div className="log-entries__header">
          <span>Timestamp</span>
          <span>Level</span>
          <span>Service</span>
          <span>Data</span>
          <span>Message</span>
        </div>
        {logEntries.map(logEntry => (<LogEntry key={logEntry.id} level={level} logEntry={logEntry}/>))}
      </Card>
    </>
  );
}

const LogEntry = memo(function LogEntry({ level, logEntry }: {level: string, logEntry: LogEntry}): JSX.Element | null {
  const [displayRest, setDisplayRest] = useState(false);

  const clickHandler = (): void => {
    if (!logEntry.rest) {
      return;
    }

    setDisplayRest(prevState => !prevState);
  };

  if ('all' !== level && logEntry.level !== level) {
    return null;
  }

  return (
    <div className="log-entry" data-level={logEntry.level} onClick={clickHandler}>
      <span className="log-entry__date">{logEntry.timestamp}</span>
      <span className="log-entry__level">{logEntry.level}</span>
      <span className="log-entry__service">{logEntry.service}</span>
      <span>{logEntry.rest ? '📦' : ''}</span>
      <span className="log-entry__message">{logEntry.message}</span>
      {displayRest ? <pre className="log-entry__data">{JSON.stringify(logEntry.rest, null, 2)}</pre> : null}
    </div>
  );
});