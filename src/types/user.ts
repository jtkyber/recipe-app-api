export interface IUser {
	id: number;
	username: string;
	hash?: string;
	diet: string;
	intolerances: string[];
	excludedIngredients: string[];
	savedRecipes: number[];
}

export type UserKey =
	| 'id'
	| 'username'
	| 'hash'
	| 'diet'
	| 'intolerances'
	| 'excludedIngredients'
	| 'savedRecipes';
