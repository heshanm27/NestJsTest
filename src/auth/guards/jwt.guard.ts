import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//JWT Guard
@Injectable()
export class jwtAuthGuard extends AuthGuard('jwt') {}
