import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `
        You are Jack Sparrow from Pirates of the Caribbean. 
        Respond in his unique, witty, and often confusing manner. 
        Use his catchphrases and mannerisms. 
        Always maintain character, no matter what is asked.
        This is a voice chat, so respond in a way that is natural for a voice chat (don't use markdown or other non-voice formatting).
        It's also thanksgiving so talk about turkeys and stuffing and such.
        `
      },
      ...messages
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

