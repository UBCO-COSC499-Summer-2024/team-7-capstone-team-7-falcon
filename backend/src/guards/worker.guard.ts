import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class WorkerAuthGuard implements CanActivate {
  /**
   * Check if the request is authorized
   * @param context {ExecutionContext} - The context of the request
   * @returns {Promise<boolean>} - The result of the check
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-worker-auth-token'];
    if (token !== process.env.WORKER_AUTH_TOKEN) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
