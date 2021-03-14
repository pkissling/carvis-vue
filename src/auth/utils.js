import { getInstance } from "../auth";

export const obtainJwtToken = async () => {

  const authService = getInstance();

  // If loading has already finished, check our auth state using `onLoaded()`
  if (!authService.loading) {
    return onLoaded();
  }

  // Watch for the loading property to change before we check isAuthenticated
  authService.$watch("loading", loading => {
    if (loading === false) {
      return onLoaded();
    }
  });
}

const onLoaded = async () => {
  const authService = getInstance();

  if (authService.isAuthenticated) {
    // Return token if authenticated
    const token = await authService.getIdTokenClaims()
    return token.__raw
  } else {
    // otherwise login
    authService.loginWithRedirect({});
  }
};

