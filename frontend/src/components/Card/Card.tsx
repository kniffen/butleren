import type { JSX } from 'react';
import './Card.scss';

export const Card = ({ className, title, children }: {className?: string, title: string, children: React.ReactNode}): JSX.Element => {
  return (
    <div className={`card ${className}`}>
      <h2 className="card__title">{title}</h2>
      {children}
    </div>
  );
};