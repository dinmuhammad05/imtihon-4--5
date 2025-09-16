import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/common/enum/roles.enum';

export const ROLES_KEY = 'roles';
export const RolesDec = (...roles: (Roles | string)[]) =>
  SetMetadata(ROLES_KEY, roles);