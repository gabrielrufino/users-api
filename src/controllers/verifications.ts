import type { Request, Response } from 'express';

import { User } from '../entities/user';
import { orm } from '../start/database';

const em = orm.em.fork();

export default {
  create: async (request: Request, response: Response) => {
    const { user_id: userId, key } = request.body;

    const user = await em
      .findOne(User, { id: userId });

    if (user == null) {
      return response.status(404).json({
        error: 'User not found',
      });
    }

    if (key === user.emailVerificationKey) {
      user.isEmailVerified = true;
      user.emailVerificationKey = '';
    } else {
      return response.status(401).json({
        error: 'Wrong key',
      });
    }

    await em.flush();

    return response.status(201).json({
      success: 'Email verified',
    });
  },
};
