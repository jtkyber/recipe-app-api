import { Request, Response } from 'express';
import { Knex } from 'knex';
import { IUser } from '../../types/user';
import { isNumber, returnedKeys } from '../../utils/utils';

export const getUser = async (req: Request, res: Response, db: Knex) => {
	const { id } = req.query;

	if (typeof id !== 'string' || !isNumber(id)) throw new Error('id should be a number as type string');

	const user = await db<IUser>('users')
		.where({ id: parseInt(id) })
		.select(returnedKeys)
		.first();

	res.json(user);
};
