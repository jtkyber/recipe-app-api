import axios from 'axios';
import { Request, Response } from 'express';
import NodeCache from 'node-cache';
import { IRecipe } from '../../types/recipe';
import { toParamValue } from '../../utils/utils';

export const getRecipeInformation = async (req: Request, res: Response, myCache: NodeCache) => {
	const { id } = req.query;

	const cacheKey = toParamValue(id);

	if (myCache.has(cacheKey)) {
		const cachedInfo = myCache.get(cacheKey);
		res.json(cachedInfo);
		return;
	}

	const recipeRes = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
		params: {
			includeNutrition: true,
			addWinePairing: false,
			addTasteData: false,
		},
		headers: {
			'x-api-key': process.env.SPOONACULAR_API_KEY || '',
			Accept: 'application/json',
		},
	});
	const recipeInfo: IRecipe = await recipeRes.data;

	res.json(recipeInfo);

	if (recipeInfo?.id) myCache.set(cacheKey, recipeInfo);
};
