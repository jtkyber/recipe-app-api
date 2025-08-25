import fs from 'fs';
import striptags from 'striptags';
import { ISearchResult } from '../../api/types/recipe';

export const addSummaryToFile = async (data: ISearchResult) => {
	try {
		const fileContents = fs.readFileSync('./summaryList.json', 'utf-8');
		const summaryList = JSON.parse(fileContents);

		for (const recipe of data.results) {
			const summary = striptags(recipe.summary);
			if (!summaryList.includes(summary)) summaryList.push(summary);
		}

		fs.writeFile('./summaryList.json', JSON.stringify(summaryList), err => {
			if (err) throw new Error(err.message);
		});

		console.log('Number of Summaries: ' + summaryList.length);
	} catch (err) {
		console.log(err);
	}
};
