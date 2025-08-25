import { Request, Response } from 'express';
import { Knex } from 'knex';
import { IUser } from '../../types/user';

export const updateExcludedIngredients = async (req: Request, res: Response, db: Knex) => {
	const { id, newExcludedIngredients } = req.body;

	if (typeof id !== 'number') throw new Error('id should be a number');
	if (!Array.isArray(newExcludedIngredients)) {
		throw new Error('diet should be a string array');
	}

	const [user] = await db<IUser>('users')
		.where({ id: id })
		.update({ excludedIngredients: newExcludedIngredients })
		.returning('excludedIngredients');

	res.json(user.excludedIngredients);
};
