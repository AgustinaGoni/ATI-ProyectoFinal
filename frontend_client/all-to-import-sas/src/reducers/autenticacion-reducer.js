export const initialState = {
  isLoginOpen: false,
  isSignInModalOpen: false,
};

export const AUTENTICACION_ACTION_TYPES = {
  LOGIN_OPEN: "LOGIN_OPEN",
  LOGIN_CLOSE: "LOGIN_CLOSE",
  REGISTRARSE_OPEN: "REGISTRARSE_OPEN",
  REGISTRARSE_CLOSE: "REGISTRARSE_CLOSE",
  LOGOUT: "LOGOUT",
};

export const autenticacionReducer = (state, action) => {
  const { type } = action;
  switch (type) {
    case AUTENTICACION_ACTION_TYPES.LOGIN_OPEN: {
      return { ...state, isLoginOpen: false };
    }
    case AUTENTICACION_ACTION_TYPES.LOGIN_CLOSE: {
      return { ...state, isLoginOpen: false };
    }
    case AUTENTICACION_ACTION_TYPES.REGISTRARSE_OPEN: {
      return { ...state, isSignInModalOpen: true };
    }
    case AUTENTICACION_ACTION_TYPES.REGISTRARSE_CLOSE: {
      return { ...state, isSignInModalOpen: false };
    }
    default:
      return state;
  }
};
