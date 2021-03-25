import { getAuthInstance } from "../auth";

export default class UserService {

  static getUsername() {
    const user = getAuthInstance().user
    if (user === undefined) {
      return undefined
    }

    return user.sub
  }

  static isAdmin() {
    const user = getAuthInstance().user
    if (user === undefined) {
      return false
    }
    const roles = user['http://blumenerd.net/roles']
    if (roles === undefined) {
      return false
    }

    return roles.some(role => role === 'admin')
  }
}

