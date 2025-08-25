import { Request, Response } from 'express';
import { Knex } from 'knex';
import { IUser } from '../../types/user';

export const updateUsername = async (req: Request, res: Response, db: Knex) => {
	const { id, newUsername } = req.body;

	if (typeof id !== 'number') throw new Error('id should be a number');
	if (typeof newUsername !== 'string') throw new Error('newUsername should be a string');

	const [user] = await db<IUser>('users')
		.where({ id: id })
		.update({ username: newUsername })
		.returning('username');

	res.json(user.username);
};
