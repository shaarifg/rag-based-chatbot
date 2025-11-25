import Parser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import embeddingService from "../services/embeddingService.js";
import vectorStore from "../database/vectorStore.js";

const RSS_FEEDS = [
  "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
  "https://feeds.bbci.co.uk/news/technology/rss.xml",
  "https://www.theverge.com/rss/index.xml",
  "http://feeds.arstechnica.com/arstechnica/index",
];

class NewsIngestion {
  constructor() {
    this.parser = new Parser();
    this.articles = [];
  }

  async fetchRSSArticles() {
    console.log("📰 Fetching RSS feeds...");

    for (const feedUrl of RSS_FEEDS) {
      try {
        const feed = await this.parser.parseURL(feedUrl);
        console.log(
          `✅ Fetched ${feed.items.length} articles from ${feed.title}`
        );

        for (const item of feed.items.slice(0, 15)) {
          this.articles.push({
            title: item.title,
            content: item.contentSnippet || item.description || "",
            url: item.link,
            source: feed.title,
            pubDate: item.pubDate,
          });
        }
      } catch (error) {
        console.error(`❌ Error fetching ${feedUrl}:`, error.message);
      }
    }

    return this.articles;
  }

  async scrapeArticleContent(url) {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      const $ = cheerio.load(response.data);

      // Remove script and style tags
      $("script, style, nav, footer, aside").remove();

      // Try common article content selectors
      const selectors = [
        "article p",
        ".article-content p",
        ".post-content p",
        ".entry-content p",
        "main p",
      ];

      for (const selector of selectors) {
        const paragraphs = $(selector).text();
        if (paragraphs.length > 200) {
          return paragraphs.slice(0, 2000); // Limit to 2000 chars
        }
      }

      return $("p").text().slice(0, 2000);
    } catch (error) {
      return null;
    }
  }

  chunkText(text, maxLength = 500) {
    const chunks = [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    let currentChunk = "";

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxLength) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }

    if (currentChunk) chunks.push(currentChunk.trim());

    return chunks;
  }

  async processArticles() {
    console.log("🔄 Processing articles...");

    const documents = [];
    let docId = 1;

    for (const article of this.articles) {
      const fullContent = await this.scrapeArticleContent(article.url);
      const content = fullContent || article.content;

      if (!content || content.length < 50) continue;

      const chunks = this.chunkText(content);

      for (const chunk of chunks) {
        documents.push({
          id: docId++,
          text: chunk,
          title: article.title,
          url: article.url,
          source: article.source,
          timestamp: article.pubDate,
        });
      }
    }

    console.log(`📝 Created ${documents.length} document chunks`);
    return documents;
  }

  async embedDocuments(documents) {
    console.log("🧮 Generating embeddings...");

    const batchSize = 10;
    const embeddedDocs = [];

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      const texts = batch.map((doc) => doc.text);

      try {
        const embeddings = await embeddingService.generateBatchEmbeddings(
          texts
        );

        batch.forEach((doc, idx) => {
          embeddedDocs.push({
            ...doc,
            embedding: embeddings[idx],
          });
        });

        console.log(`✅ Processed batch ${i / batchSize + 1}`);
      } catch (error) {
        console.error(`❌ Error in batch ${i / batchSize + 1}:`, error.message);
      }
    }

    return embeddedDocs;
  }

  async ingest() {
    try {
      await vectorStore.initialize();

      await this.fetchRSSArticles();
      const documents = await this.processArticles();
      const embeddedDocs = await this.embedDocuments(documents);

      const count = await vectorStore.upsertDocuments(embeddedDocs);

      console.log(
        `✅ Successfully ingested ${count} documents into vector store`
      );
    } catch (error) {
      console.error("❌ Ingestion failed:", error);
    }
  }
}

const ingestion = new NewsIngestion();
ingestion.ingest();
