import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Global,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Global()
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //Get the roles from the passed as metadata
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    //If no roles are required, return true
    if (!requiredRoles) {
      return true;
    }

    //Get the user from the request
    const { user } = context.switchToHttp().getRequest();

    //If the user has the required role, return true
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
