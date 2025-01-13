import { Entity, Property } from '@mikro-orm/core';

import { InitialEntity } from './initial.entity';

@Entity()
export class User extends InitialEntity {
  @Property()
    name!: string;

  @Property()
    email!: string;

  @Property({ hidden: true })
    emailVerificationKey = '';

  @Property()
    isEmailVerified = false;

  @Property()
    username!: string;

  @Property({ hidden: true })
    password!: string;

  @Property({ hidden: true })
    createdAt: Date = new Date();

  @Property({ hidden: true, onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
