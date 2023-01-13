import { SetMetadata } from '@nestjs/common';

export enum Role {
  Admin = 'admin',
  Writer = 'writer',
  Reader = 'reader',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
