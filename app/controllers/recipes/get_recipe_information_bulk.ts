import axios from 'axios';
import { Request, Response } from 'express';
import NodeCache from 'node-cache';
import { IRecipe } from '../../types/recipe';

export const getRecipeInformationBulk = async (req: Request, res: Response, myCache: NodeCache) => {
	const { ids } = req.query;

	if (ids === undefined) throw new Error('"ids" is undefined');
	if (typeof ids !== 'string') throw new Error('"ids" should be of type "string"');

	const idsParsed: number[] = ids.split(',').map(id => parseInt(id));

	let recipeBulk: IRecipe[] = [];

	const cachedIDs: number[] = [];
	idsParsed.forEach(key => {
		if (myCache.has(key)) {
			const cachedInfo: IRecipe | undefined = myCache.get(key);
			if (cachedInfo !== undefined) {
				cachedIDs.push(cachedInfo.id);
				recipeBulk.push(cachedInfo);
			}
		}
	});

	const recipeIDsNotInCache = idsParsed.filter(id => !cachedIDs.includes(id));

	if (!recipeIDsNotInCache.length) {
		res.json(recipeBulk);
		return;
	}

	const recipeBulkRes = await axios.get('https://api.spoonacular.com/recipes/informationBulk', {
		params: {
			ids: recipeIDsNotInCache.join(','),
		},
		headers: {
			'x-api-key': process.env.SPOONACULAR_API_KEY || '',
			Accept: 'application/json',
		},
	});
	const data: IRecipe[] = await recipeBulkRes.data;
	recipeBulk.push(...data);

	res.json(recipeBulk);

	data.forEach(recipe => {
		myCache.set(recipe.id, recipe);
	});
};
