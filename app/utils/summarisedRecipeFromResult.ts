import { pipeline, SummarizationOutput } from '@xenova/transformers';
import { GenerationConfigType } from '@xenova/transformers/types/utils/generation';
import striptags from 'striptags';
import { ISearchResult } from '../types/recipe';

export default async function summarizeRecipeFromResult(data: ISearchResult) {
	try {
		const instruction = `
		Summarize the following recipe description into 3–5 sentences that sound like a tasty, enticing meal you'd see in a cookbook. Be descriptive and casual, and focus on how the dish is made and served.

		### Example:

		Input:
		Butternut Squash Soup (In Half An Hour!) requires about 30 minutes from start to finish. For $1.25 per serving, you get a hor d'oeuvre that serves 8. Watching your figure? This gluten free, dairy free, lacto ovo vegetarian, and vegan recipe has 252 calories, 9g of protein, and 6g of fat per serving. It will be a hit at your Autumn event. 5 people have made this recipe and would make it again. It is brought to you by Foodista. Head to the store and pick up salt and pepper, black-eyed peas, collard greens, and a few other things to make it today. With a spoonacular score of 95%, this dish is great. Try Half-Hour Chili, Half-Hour Chili, and Half-Hour Chili for similar recipes.

		Output:
		Dive into a cozy bowl of Butternut Squash Soup, whipped up in just 30 minutes with a vibrant blend of sweet squash, hearty black-eyed peas, and tender collard greens. Simply sauté the veggies, simmer with a splash of broth, and blend until velvety smooth for a warm, autumnal hug in a bowl. Season with a pinch of salt and pepper to bring out the earthy flavors, then serve piping hot for a vegan, gluten-free delight. Perfect for a chilly evening, this crowd-pleaser is ready to impress at your next fall gathering, paired with a crusty piece of bread for dipping.

		### Now summarize this:\n\n`;

		const options: GenerationConfigType = {
			max_length: 100,
			min_length: 50,
			num_beams: 4,
			length_penalty: 0.8,
			no_repeat_ngram_size: 3,
			do_sample: true,
			top_p: 0.9,
			temperature: 0.8,
		};

		// distilbart-cnn-6-6
		// t5-small
		/// flan-t5-xxl
		/// flan-t5-small
		const pipe = await pipeline('summarization', 'Xenova/t5-small', {
			progress_callback: (status: string) => {
				console.log('[Progress]', status);
			},
		});
		// const allSummaries = data.results.map(r => striptags(r.summary));
		// const out = (await pipe(allSummaries, options)) as SummarizationOutput;
		for (let i = 0; i < data.results.length; i++) {
			console.log(i);
			console.time();
			const out = (await pipe(striptags(data.results[i].summary))) as SummarizationOutput;
			console.timeEnd();
			data.results[i].shortSummary = out[0].summary_text;
		}
		console.log(data.results.map(r => r.shortSummary));
	} catch (err) {
		console.log(err);
	}
}
