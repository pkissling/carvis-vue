import { getAuthInstance } from "../auth"

export default {

  getUsername() {
    const user = this.getUser()
    return user ? user.sub : undefined
  },

  getName() {
    const user = this.getUser()
    return user ? user.name : undefined
  },

  getPicture() {
    const user = this.getUser()
    return user ? user.picture : undefined
  },

  isAdmin() {
    return this.hasRole('admin')
  },

  isUser() {
    return this.hasRole('user')
  },

  hasAccess() {
    return this.isAdmin() || this.isUser()
  },

  getUser() {
    return getAuthInstance().user
  },

  hasRole(requiredRole) {
    if (!requiredRole) {
      return false
    }

    const user = this.getUser()
    if (!user) {
      return false
    }

    const roles = user['https://carvis.cloud/roles'] || []
    return roles.some(role => role === requiredRole)
  }
}

