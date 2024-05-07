import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthUser } from './auth.service';

@Injectable()
export class ApiAuthGuard extends AuthGuard('jwt') {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (!(await super.canActivate(ctx))) {
      return false;
    }

    const req = ctx.switchToHttp().getRequest();
    const user = req.user as AuthUser;

    if (!user) {
      return false;
    }

    return true;
  }
}
