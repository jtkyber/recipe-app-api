import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Knex } from 'knex';
import { IUser } from '../../types/user';
import { returnedKeys } from '../../utils/utils';

export const signUp = async (req: Request, res: Response, db: Knex) => {
	const {
		username,
		password,
		diet,
		intolerances,
		excludedIngredients,
	}: {
		username: string;
		password: string;
		diet: string;
		intolerances: string[];
		excludedIngredients: string[];
	} = req.body;

	const hash = await bcrypt.hash(password, 10);

	const [user] = await db<IUser>('users')
		.insert({
			username: username,
			hash: hash,
			diet: diet,
			intolerances: intolerances,
			excludedIngredients: excludedIngredients,
		})
		.returning(returnedKeys);

	res.json(user);
};
