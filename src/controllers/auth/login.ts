import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Knex } from 'knex';
import { IUser } from '../../types/user';
import { returnedKeys } from '../../utils/utils';

export const login = async (req: Request, res: Response, db: Knex) => {
	const { username, password } = req.body;

	const user = await db<IUser>('users')
		.where({ username: username })
		.select([...returnedKeys, 'hash'])
		.first();

	if (!user?.hash) throw new Error('No matching username');

	const match = await bcrypt.compare(password, user.hash);

	if (!match) throw new Error('Wrong password');

	delete user.hash;

	res.json(user);
};
