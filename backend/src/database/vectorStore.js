import { QdrantClient } from '@qdrant/js-client-rest';
import config from '../config/index.js';

class VectorStore {
  constructor() {
    this.client = new QdrantClient({ url: config.qdrant.url });
    this.collectionName = config.qdrant.collection;
  }

  async initialize() {
    try {
      await this.client.getCollection(this.collectionName);
      console.log('✅ Qdrant collection exists');
    } catch (error) {
      console.log('📦 Creating Qdrant collection...');
      await this.client.createCollection(this.collectionName, {
        vectors: {
          size: 768, // Jina embeddings dimension
          distance: 'Cosine',
        },
      });
      console.log('✅ Qdrant collection created');
    }
  }

  async upsertDocuments(documents) {
    const points = documents.map((doc, idx) => ({
      id: doc.id || idx + 1,
      vector: doc.embedding,
      payload: {
        text: doc.text,
        source: doc.source || 'unknown',
        title: doc.title || '',
        url: doc.url || '',
        timestamp: doc.timestamp || new Date().toISOString(),
      },
    }));

    await this.client.upsert(this.collectionName, {
      wait: true,
      points,
    });

    return points.length;
  }

  async search(queryEmbedding, topK = config.rag.topK) {
    const results = await this.client.search(this.collectionName, {
      vector: queryEmbedding,
      limit: topK,
      with_payload: true,
    });

    return results.map(result => ({
      score: result.score,
      text: result.payload.text,
      source: result.payload.source,
      title: result.payload.title,
      url: result.payload.url,
    }));
  }

  async deleteCollection() {
    await this.client.deleteCollection(this.collectionName);
  }

  async getCollectionInfo() {
    return await this.client.getCollection(this.collectionName);
  }
}

export default new VectorStore();
