import axios from 'axios';
import { Request, Response } from 'express';
import NodeCache from 'node-cache';
import { toParamValue } from '../../utils/utils';

export const recipeAutocomplete = async (req: Request, res: Response, myCache: NodeCache) => {
	const { text, count } = req.query;

	const cacheKey = toParamValue(text) + toParamValue(count);

	if (myCache.has(cacheKey)) {
		const cachedAutocomplete = myCache.get(cacheKey);
		res.json(cachedAutocomplete);
		return;
	}

	const response = await axios('https://api.spoonacular.com/food/ingredients/autocomplete?', {
		params: {
			query: text,
			number: count,
		},
		headers: {
			'x-api-key': process.env.SPOONACULAR_API_KEY,
		},
	});

	const data = await response.data;

	res.json(data);

	if (data?.length) myCache.set(cacheKey, data);
};
