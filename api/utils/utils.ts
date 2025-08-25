import { UserKey } from '../../api/types/user';

export const toParamValue = (value: any): string => {
	if (Array.isArray(value)) {
		return value.join(',');
	} else if (typeof value === 'string') {
		return value;
	} else {
		return '';
	}
};

export const isNumber = (str: any) => {
	return !isNaN(parseFloat(str)) && isFinite(str);
};

export const returnedKeys: UserKey[] = [
	'id',
	'username',
	'diet',
	'intolerances',
	'excludedIngredients',
	'savedRecipes',
];
