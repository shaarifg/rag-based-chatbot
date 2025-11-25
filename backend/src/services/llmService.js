import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';

class LLMService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: config.gemini.model });
  }

  async generateResponse(query, context, history = []) {
    const contextText = context
      .map((doc, idx) => `[${idx + 1}] ${doc.text}\nSource: ${doc.title || doc.source}`)
      .join('\n\n');

    const systemPrompt = `You are a helpful AI assistant with access to recent news articles. Use the provided context to answer questions accurately. If the context doesn't contain relevant information, say so clearly.

Context from news articles:
${contextText}

Previous conversation:
${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User query: ${query}

Provide a concise, accurate answer based on the context. Cite sources when relevant.`;

    try {
      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('LLM generation error:', error.message);
      throw new Error('Failed to generate response');
    }
  }

  async *generateStreamResponse(query, context, history = []) {
    const contextText = context
      .map((doc, idx) => `[${idx + 1}] ${doc.text}\nSource: ${doc.title || doc.source}`)
      .join('\n\n');

    const systemPrompt = `You are a helpful AI assistant with access to recent news articles. Use the provided context to answer questions accurately.

Context:
${contextText}

Previous conversation:
${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User query: ${query}`;

    try {
      const result = await this.model.generateContentStream(systemPrompt);
      
      for await (const chunk of result.stream) {
        const text = chunk.text();
        yield text;
      }
    } catch (error) {
      console.error('Stream generation error:', error.message);
      throw new Error('Failed to generate stream response');
    }
  }
}

export default new LLMService();
