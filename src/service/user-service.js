import { getAuthInstance } from "../auth";

export default class UserService {

  static getUsername() {
    const user = this.getUser()
    return user ? user.sub : undefined
  }

  static getName() {
    const user = this.getUser()
    return user ? user.name : undefined
  }

  static isAdmin() {
    return this.hasRole('admin')
  }

  static isUser() {
    return this.hasRole('user')
  }

  static getUser() {
    return getAuthInstance().user
  }

  static hasRole(requiredRole) {
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

