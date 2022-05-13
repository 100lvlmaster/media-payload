import { Role, User } from "../types";
import { IAccessArgs } from "../types/types";

export const USER_ROLES: Role[] = ['editor', 'author', 'translator', 'freelancer'];
export const ADMIN_ROLE: Role = 'admin';
export const SUPERADMIN_ROLE: Role ='superAdmin';

/**
 * authorize a request by comparing the current user with one or more roles
 * @param allRoles
 * @param user
 * @returns {Function}
 */
 export const checkUserRoles = (allRoles: Role[], user: Partial<User>): boolean => {
  if (user) {
    let userRoles: Role[];
    switch (true) {
      case typeof user.roles === 'string':
        userRoles = [user.roles as Role];
        break;
      case Array.isArray(user.roles):
        userRoles = user.roles as Role[];
        break;
      default:
        userRoles = [];
        break;
    }
    if (allRoles.some((role) => userRoles.some((individualRole) => individualRole === role))) {
      return true;
    }
  }

  return false;
};

export const checkRoles = (allRoles: Role[], roleToCheck: Role | Role[]): boolean => {
  if (typeof roleToCheck === 'string') {
    return allRoles.includes(roleToCheck);
  } else if (Array.isArray(roleToCheck)) {
    return checkUserRoles(allRoles, {roles: roleToCheck});
  }

  return false;
}

export const checkIsLoggedIn = ({ req: { user } }: IAccessArgs) => {
  return !!user;
}