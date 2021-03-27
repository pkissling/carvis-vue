import { getAuthInstance } from "../auth";

export default class UserService {

  static getUsername() {
    const user = this.getUser()
    if (!user) {
      return undefined
    }

    return user.sub
  }

  static getName() {
    const user = this.getUser()
    if (!user) {
      return undefined
    }

    return user.name
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
    const user = this.getUser()
    if (!user) {
      return false
    }

    const roles = user['https://carvis.cloud/roles']
    if (!roles) {
      return false
    }

    return roles.some(role => role === requiredRole)
  }
}

