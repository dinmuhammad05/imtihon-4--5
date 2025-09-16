import { Roles } from '../enum/roles.enum';

export interface IPayload {
  id: string;
  role: Roles;
}
