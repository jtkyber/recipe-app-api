import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Knex } from 'knex';
import { IUser } from '../../types/user';

export const updatePassword = async (req: Request, res: Response, db: Knex) => {
	const { id, password, newPassword } = req.body;

	if (typeof id !== 'number') throw new Error('id should be a number');
	if (typeof password !== 'string' || typeof newPassword !== 'string') {
		throw new Error('passwords should be of type string');
	}

	const user = await db<IUser>('users').where({ id }).select('hash').first();

	if (!user?.hash) throw new Error('User does not exist');

	const match = await bcrypt.compare(password, user.hash);

	if (!match) throw new Error('Incorrect current password');

	const hash = await bcrypt.hash(newPassword, 10);

	await db<IUser>('users').where({ id }).update({ hash });

	res.json(true);
};
