import { getAuthInstance } from "../auth";

export const obtainJwtToken = async () => {

  const authService = getAuthInstance();

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
  const authService = getAuthInstance();

  if (authService.isAuthenticated) {
    // Return token if authenticated
    const token = await authService.getIdTokenClaims()
    if (token && token.__raw) {
      return token.__raw
    }
  }

  // otherwise login
  authService.loginWithRedirect({});
};

