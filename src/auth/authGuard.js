import router from "../router";
import { getAuthInstance } from "./index";
import userService from '../service/user-service'

export default (to, from, next) => {
  const authService = getAuthInstance();

  const fn = () => {
    // If the user is authenticated, continue with the route
    if (authService.isAuthenticated) {
      if (userService.isUser() || userService.isAdmin()) {
        return next();
      } else {
        return next({ path: '/forbidden' })
      }
    }

    // Otherwise, log in
    authService.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
  };

  // If loading has already finished, check our auth state using `fn()`
  if (!authService.loading) {
    return fn();
  }

  // Watch for the loading property to change before we check isAuthenticated
  authService.$watch("loading", loading => {
    if (loading === false) {
      return fn();
    }
  });
};