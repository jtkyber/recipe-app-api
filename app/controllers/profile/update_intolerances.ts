import { Request, Response } from 'express';
import { Knex } from 'knex';
import { IUser } from '../../types/user';

export const updateIntolerances = async (req: Request, res: Response, db: Knex) => {
	const { id, newIntolerances } = req.body;

	if (typeof id !== 'number') throw new Error('id should be a number');
	if (!Array.isArray(newIntolerances)) {
		throw new Error('diet should be a string array');
	}

	const [user] = await db<IUser>('users')
		.where({ id: id })
		.update({ intolerances: newIntolerances })
		.returning('intolerances');

	res.json(user.intolerances);
};
