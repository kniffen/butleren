import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './Modal.scss';

interface ModalProps {
  title: string;
  buttonText: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

export const Modal = function({ title, buttonText, children, onClose }: ModalProps): ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  return <>
    <button className="modal-button" onClick={() => { setIsOpen(true); }}>{buttonText}</button>

    {isOpen ?
      createPortal(
      <div className="modal-background" onClick={() => { setIsOpen(false); onClose?.(); }}>
        <div className="modal" onClick={(e) => { e.stopPropagation(); }}>
          <header className="modal__header">
            <h2 className="modal__title">{title}</h2>
            <span className="modal__close" onClick={() => { setIsOpen(false); onClose?.(); }}>&times;</span>
          </header>
          {children}
        </div>
      </div>,
      document.body
    ) :
    null
  }</>;
};