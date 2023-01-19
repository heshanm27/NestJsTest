import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//Local Guard
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
