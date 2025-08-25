import cors from 'cors';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import NodeCache from 'node-cache';

const myCache = new NodeCache();
const app = express();
const port = 3000;

app.use(express.json());
app.use(
	cors({
		origin: ['http://localhost:5173', 'https://recipe-app-ten-xi.vercel.app'],
	})
);

import { GoogleGenAI } from '@google/genai';
import { Knex, knex } from 'knex';
import { getUser } from './controllers/auth/get_user';
import { login } from './controllers/auth/login';
import { signUp } from './controllers/auth/sign_up';
import { updateDiet } from './controllers/profile/update_diet';
import { updateExcludedIngredients } from './controllers/profile/update_excluded_ingredients';
import { updateIntolerances } from './controllers/profile/update_intolerances';
import { updatePassword } from './controllers/profile/update_password';
import { updateProfile } from './controllers/profile/update_profile';
import { updateUsername } from './controllers/profile/update_username';
import { getRecipeInformation } from './controllers/recipes/get_recipe_information';
import { getRecipeInformationBulk } from './controllers/recipes/get_recipe_information_bulk';
import { getRecipeSummary } from './controllers/recipes/get_recipe_summary';
import { getRecipes } from './controllers/recipes/get_recipes';
import { recipeAutocomplete } from './controllers/recipes/recipe_autocomplete';
import { toggleSaveRecipe } from './controllers/recipes/save_recipe';

const knexConfig: Knex.Config = {
	client: 'pg',
	connection: {
		connectionString: process.env.DB_CONNECTION_STRING,
	},
};
const db = knex(knexConfig);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get('/', async (req, res) => {
	res.send('Working');
});

app.get('/getUser', async (req, res, next) => {
	try {
		console.log('/getUser');
		await getUser(req, res, db);
	} catch (err) {
		next(err);
	}
});

app.post('/login', async (req, res, next) => {
	try {
		await login(req, res, db);
	} catch (err) {
		next(err);
	}
});

app.post('/signUp', async (req, res, next) => {
	try {
		await signUp(req, res, db);
	} catch (err) {
		next(err);
	}
});

app.get('/getRecipes', async (req, res, next) => {
	try {
		await getRecipes(req, res, myCache);
	} catch (err) {
		next(err);
	}
});

app.get('/getRecipeInformation', async (req, res, next) => {
	try {
		await getRecipeInformation(req, res, myCache);
	} catch (err) {
		next(err);
	}
});

app.get('/getRecipeInformationBulk', async (req, res, next) => {
	try {
		await getRecipeInformationBulk(req, res, myCache);
	} catch (err) {
		next(err);
	}
});

app.get('/getRecipeSummary', async (req, res, next) => {
	try {
		await getRecipeSummary(req, res, ai, myCache);
	} catch (err) {
		next(err);
	}
});

app.get('/getRecipeAutocomplete', async (req, res, next) => {
	try {
		await recipeAutocomplete(req, res, myCache);
	} catch (err) {
		next(err);
	}
});

app.put('/toggleSaveRecipe', async (req, res, next) => {
	try {
		await toggleSaveRecipe(req, res, db);
	} catch (err) {
		next(err);
	}
});

app.put('/updateProfile', async (req, res, next) => {
	try {
		await updateProfile(req, res, db);
	} catch (err) {
		next(err);
	}
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.log(err);
	res.status(400).send({ error: err.message });
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

module.exports = app;
