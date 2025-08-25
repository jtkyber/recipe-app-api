import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Knex } from 'knex';
import { IUser } from '../../types/user';

export const updateProfile = async (req: Request, res: Response, db: Knex) => {
	const { id, updateParam, payload } = req.body;

	if (typeof id !== 'number') throw new Error('id should be a number');

	let result;

	switch (updateParam) {
		case 'diet':
			if (typeof payload !== 'string') throw new Error('diet should be a string');
			[result] = await db<IUser>('users').where({ id: id }).update({ diet: payload }).returning('diet');
			result = result.diet;
			break;
		case 'excluded_ingredients':
			if (!Array.isArray(payload)) {
				throw new Error('excluded_ingredients should be a string array');
			}
			[result] = await db<IUser>('users')
				.where({ id: id })
				.update({ excludedIngredients: payload })
				.returning('excludedIngredients');
			result = result.excludedIngredients;
			break;
		case 'intolerances':
			if (!Array.isArray(payload)) {
				throw new Error('intolerances should be a string array');
			}
			[result] = await db<IUser>('users')
				.where({ id: id })
				.update({ intolerances: payload })
				.returning('intolerances');
			result = result.intolerances;
			break;
		case 'username':
			if (typeof payload !== 'string') throw new Error('newUsername should be a string');
			[result] = await db<IUser>('users')
				.where({ id: id })
				.update({ username: payload })
				.returning('username');
			result = result.username;
			break;
		case 'password':
			if (typeof payload.password !== 'string' || typeof payload.newPassword !== 'string') {
				throw new Error('passwords should be of type string');
			}
			const user = await db<IUser>('users').where({ id }).select('hash').first();

			if (!user?.hash) throw new Error('User does not exist');

			const match = await bcrypt.compare(payload.password, user.hash);

			if (!match) throw new Error('Incorrect current password');

			const hash = await bcrypt.hash(payload.newPassword, 10);

			await db<IUser>('users').where({ id }).update({ hash });
			break;
	}

	res.json(result);
};
