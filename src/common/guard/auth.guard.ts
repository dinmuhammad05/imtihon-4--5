// auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { ROLES_KEY } from 'src/common/decorator/roles-decorator';
import { dbConfig } from '../../config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    //  Agar route @Roles('public') bo'lsa — token talab qilinmaydi
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    
    if (roles?.includes('public')) return true;

    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers.authorization as string | undefined;

    if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = auth.slice(7);
    try {
      const payload = jwt.verify(token, dbConfig.TOKEN.access_token_key);
      req.user = payload; // { id, role, ... } bo'lishi kerak

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
