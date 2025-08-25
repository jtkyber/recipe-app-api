import axios from 'axios';
import { Request, Response } from 'express';
import NodeCache from 'node-cache';
import { ISearchResult } from '../../types/recipe';
import { toParamValue } from '../../utils/utils';

export const getRecipes = async (req: Request, res: Response, myCache: NodeCache) => {
	const query = req.query;
	const {
		searchQuery,
		sortOption,
		diet,
		intolerances,
		excludedIngredients,
		cuisine,
		ingredients,
		mealType,
		instructionsRequired,
		maxReadyTime,
		number,
		page,
		ignoreProfileFilters,
	} = query;

	if (!(typeof number === 'string' && typeof page === 'string')) {
		throw new Error('"number" and "page" must be numbers of type string');
	}

	const cacheKey: string = Object.values(req.query).reduce((acc: string, value: any) => {
		return acc.concat(toParamValue(value));
	}, '');

	if (myCache.has(cacheKey)) {
		const cachedRecipe = myCache.get(cacheKey);
		res.json(cachedRecipe);
		return;
	}

	let realExcludedIngredients = excludedIngredients;

	if (typeof ingredients === 'string' && typeof excludedIngredients === 'string') {
		const ingredientsArray = ingredients.split(',');
		const excludedIngredientsArray = excludedIngredients.split(',');
		realExcludedIngredients = excludedIngredientsArray.filter(ing => {
			return !ingredientsArray.includes(ing);
		});
		realExcludedIngredients = realExcludedIngredients.join(',');
	}

	const recipeRes = await axios.get('https://api.spoonacular.com/recipes/complexSearch?', {
		params: {
			query: toParamValue(searchQuery),
			sort: toParamValue(sortOption),
			cuisine: toParamValue(cuisine),
			includeIngredients: toParamValue(ingredients),
			diet: ignoreProfileFilters === 'true' ? '' : toParamValue(diet),
			intolerances: ignoreProfileFilters === 'true' ? '' : toParamValue(intolerances),
			excludeIngredients: ignoreProfileFilters === 'true' ? '' : toParamValue(realExcludedIngredients),
			type: toParamValue(mealType),
			addRecipeInformation: 'true',
			instructionsRequired: toParamValue(instructionsRequired),
			maxReadyTime: toParamValue(maxReadyTime),
			number: toParamValue(number),
			offset: toParamValue((parseInt(page) * parseInt(number)).toString()),
		},
		headers: {
			'x-api-key': process.env.SPOONACULAR_API_KEY || '',
			Accept: 'application/json',
		},
	});

	const data = (await recipeRes.data) as ISearchResult;

	if (typeof data.number === 'number' && !isNaN(data.number)) myCache.set(cacheKey, data);

	data.pointsRemaining = recipeRes.headers['x-api-quota-left'];
	data.pointsSpentThisRequest = recipeRes.headers['x-api-quota-request'];

	res.json(data);
};
