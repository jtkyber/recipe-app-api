import { Request, Response } from 'express';
import { Knex } from 'knex';
import { IUser } from '../../types/user';

export const updateDiet = async (req: Request, res: Response, db: Knex) => {
	const { id, newDiet } = req.body;

	if (typeof id !== 'number') throw new Error('id should be a number');
	if (typeof newDiet !== 'string') throw new Error('diet should be a string');

	const [user] = await db<IUser>('users').where({ id: id }).update({ diet: newDiet }).returning('diet');

	res.json(user.diet);
};
