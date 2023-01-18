import {
  createMongoAbility,
  AbilityBuilder,
  MongoAbility,
} from '@casl/ability';

import { User } from 'src/user/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/authorization/role.enum';
import { Post } from 'src/post/entity/post.entity';

export enum Actions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = typeof Post | typeof User | Post | User | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslPermission {
  defineAbility(user: User) {
    const { can, build } = new AbilityBuilder<
      MongoAbility<[Actions, Subjects]>
    >(createMongoAbility);

    switch (user.role) {
      case Role.Admin:
        can(Actions.Manage, 'all');
        break;
      case Role.Writer:
        can(Actions.Create, 'all');
        can(Actions.Update, Post, {
          authorId: user.id,
        });
        can(Actions.Delete, Post, {
          authorId: user.id,
        });
        can(Actions.Read, Post);
        break;
      case Role.Editor:
        can(Actions.Manage, Post);
        break;
      default:
        can(Actions.Read, 'all');
    }

    return build({
      detectSubjectType: (type) => type.constructor as any,
    });
  }
}
