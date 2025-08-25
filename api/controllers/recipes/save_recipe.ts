import { Request, Response } from 'express';
import { Knex } from 'knex';
import { IUser } from '../../types/user';
import { returnedKeys } from '../../utils/utils';

export const toggleSaveRecipe = async (req: Request, res: Response, db: Knex) => {
	const { id, recipeId }: { id: number; recipeId: number } = req.body;

	const user = await db<IUser>('users').where({ id: id }).select(returnedKeys).first();

	let payload;
	let wasAdded;
	if (user?.savedRecipes.includes(recipeId)) {
		wasAdded = false;
		const index = user.savedRecipes.indexOf(recipeId);
		const newArr = user.savedRecipes;
		newArr.splice(index, 1);

		[payload] = await db<IUser>('users')
			.where({ id: id })
			.update({ savedRecipes: newArr })
			.returning('savedRecipes');
	} else if (user?.savedRecipes !== undefined) {
		wasAdded = true;
		const newArr = user.savedRecipes;
		newArr.push(recipeId);

		[payload] = await db<IUser>('users')
			.where({ id: id })
			.update({ savedRecipes: newArr })
			.returning('savedRecipes');
	}

	const data = {
		payload: payload?.savedRecipes,
		wasAdded: wasAdded,
	};

	res.json(data);
};
