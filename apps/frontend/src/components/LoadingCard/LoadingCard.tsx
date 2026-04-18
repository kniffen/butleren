import type { JSX } from 'react';
import './LoadingCard.scss';

interface LoadingCardProps {
  height?: string;
}

export const LoadingCard = function({ height } : LoadingCardProps): JSX.Element {
  return <div className="loading-card" style={{ height: height || '8rem' }}></div>;
};