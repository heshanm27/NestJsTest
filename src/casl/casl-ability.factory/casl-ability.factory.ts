import {
  createMongoAbility,
  ExtractSubjectType,
  AbilityBuilder,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';

import { User } from 'src/user/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { PostDto } from 'src/post/dto/post.dto';
import { Role } from 'src/auth/authorization/role.enum';

export enum Actions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof PostDto | typeof User> | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      MongoAbility<[Actions, Subjects]>
    >(createMongoAbility);

    console.log('userid', user.id);
    console.log('userrole', user.role);
    switch (user.role) {
      case Role.Admin:
        can(Actions.Manage, 'all');
        break;
      case Role.Writer:
        can(Actions.Create, 'all');
        // can(Actions.Update, User, { id: 1 });
        can(Actions.Delete, PostDto, { authorId: 1 });
        can(Actions.Read, PostDto);
        break;
      case Role.Editor:
        can(Actions.Manage, PostDto);
        break;
      default:
        can(Actions.Read, 'all');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
