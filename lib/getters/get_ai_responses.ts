
//hits the openAI api and gets a response

import { QueueItem } from "@/types"
import { getReviews } from "./get_reviews"



async function makePrompt(review: QueueItem): Promise<string> {
    const reviews = await getReviews()

    return `We want to write a 1-2 sentence review response. 
    Here are some other review responses for context:
    ${reviews.filter(review => review.response).map(r => `Review: ${r.review} \n Response: ${r.response}`)}
    Review: ${review.review} \n Respnse: `
}

async function getResponses(review: QueueItem): Promise<string> {

    const prompt = await makePrompt(review)

    const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: prompt,
            max_tokens: 100
        })
    })

    const responseText = (await response.json()).text
    const valid = looseValidation(review.review, responseText)

    if (!valid) {
        throw new Error('Invalid response')
    }

    return responseText

}


function looseValidation(reviewBody: string, response: string): boolean {
    if (response.length < 10 || response.length > 500) {
        return false
    }
    if (response.includes(reviewBody)) {
        return false
    }
    // TODO add more? 
    return true
}