import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isRecuperarContrasenia, setRecuperarContrasenia] = useState(false);  
  const [isFiltrarModalOpen, setFiltrarModalOpen] = useState(false);  

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const openSignupModal = () => setSignupModalOpen(true);
  const closeSignupModal = () => setSignupModalOpen(false);

  const openRecuperarContraseniaModal = () => setRecuperarContrasenia(true);
  const closeRecuperarContraseniaModal = () => setRecuperarContrasenia(false);

  const openFiltrarModal = () => setFiltrarModalOpen(true);
  const closeFiltrarModal = () => setFiltrarModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        isSignupModalOpen,
        openSignupModal,
        closeSignupModal,
        isRecuperarContrasenia,
        openRecuperarContraseniaModal,
        closeRecuperarContraseniaModal,
        isFiltrarModalOpen,
        openFiltrarModal,
        closeFiltrarModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};
