import { useState } from "react";

const useAppModal = (defaultState = false, shouldNavigate = false) => {
  const [isOpen, setIsOpen] = useState(defaultState);

  const closeModal = () => {
    if (shouldNavigate) {
      document.body.classList.remove("no-scroll");
      //

      //
    } else {
      setIsOpen(false);
      document.body.classList.remove("no-scroll");
    }
  };

  const openModal = () => {
    setIsOpen(true);
    document.body.classList.add("no-scroll");
  };

  interface AppModalProps {
    children: React.ReactNode;
    isCentered?: boolean;
    newGame?: boolean;
  }

  const AppModal = ({
    isCentered = true,
    children,
    newGame,
  }: AppModalProps) => {
    return (
      <>
        {isOpen && (
          <>
            <div className="app-modal-overlay" onClick={closeModal}></div>
            <div
              className={`app-modal ${isCentered ? "app-modal-centered" : ""} ${
                newGame ? "new-game" : ""
              } `}
            >
              {children}
            </div>
          </>
        )}
      </>
    );
  };

  return [AppModal, closeModal, openModal, isOpen];
};

export default useAppModal;
