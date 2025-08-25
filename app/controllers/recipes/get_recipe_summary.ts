import { GoogleGenAI } from '@google/genai';
import { Request, Response } from 'express';
import NodeCache from 'node-cache';
import striptags from 'striptags';
import { toParamValue } from '../../utils/utils';

export const getRecipeSummary = async (req: Request, res: Response, ai: GoogleGenAI, myCache: NodeCache) => {
	const { summary } = req.query;

	const cacheKey = toParamValue(summary);

	if (myCache.has(cacheKey)) {
		const cachedSummary = myCache.get(cacheKey);
		res.json(cachedSummary);
		return;
	}

	if (typeof summary !== 'string') {
		res.status(400).send('Request parameter is not a string');
		return;
	}

	const instruction = `
			Summarize the following recipe description into 2-3 sentences that sound like a tasty,
			enticing meal you'd see in a cookbook. Be descriptive and casual, 
			and focus on how the dish is made and served. If a diet is mentioned, you may include that as well:\n\n${striptags(
				summary
			)}`;

	const shortSummary = await ai.models.generateContent({
		model: 'gemini-2.0-flash',
		contents: instruction,
	});

	res.json(shortSummary.text);

	if (shortSummary?.text?.length) myCache.set(cacheKey, shortSummary.text);
};
