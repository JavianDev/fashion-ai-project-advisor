import { NextRequest, NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';
import fs from 'fs/promises';
import path from 'path';

// Initialize a pipeline for text embeddings
let extractor: any = null; // Will be initialized once

async function getExtractor() {
  if (extractor === null) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
}

// Load documents from the public/data directory
let documents: string[] = [];
let documentEmbeddings: number[][] = [];

async function loadKnowledgeBase() {
  if (documents.length === 0) {
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const filenames = await fs.readdir(dataDir);

    for (const filename of filenames) {
      if (filename.endsWith('.txt')) {
        const filepath = path.join(dataDir, filename);
        const content = await fs.readFile(filepath, 'utf-8');
        documents.push(content);
      }
    }

    const featureExtractor = await getExtractor();
    // Generate embeddings for all documents
    for (const doc of documents) {
      const output = await featureExtractor(doc, { pooling: 'mean', normalize: true });
      documentEmbeddings.push(Array.from(output.data) as number[]);
    }
    console.log("Knowledge base loaded and embeddings generated.");
  }
}

// Function to calculate cosine similarity
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  if (magnitude1 === 0 || magnitude2 === 0) return 0; // Avoid division by zero
  return dotProduct / (magnitude1 * magnitude2);
}

export async function POST(req: NextRequest) {
  await loadKnowledgeBase(); // Ensure knowledge base is loaded

  try {
    const { user_profile, clothing_item, occasion } = await req.json();

    let queryText = "";
    if (user_profile) {
      queryText += `User has skin tone ${user_profile.skin_tone || ''} and body type ${user_profile.body_type || ''}. `;
      if (user_profile.height) queryText += `Height is ${user_profile.height}. `;
      if (user_profile.weight) queryText += `Weight is ${user_profile.weight}. `;
      if (user_profile.bust) queryText += `Bust is ${user_profile.bust}. `;
      if (user_profile.waist) queryText += `Waist is ${user_profile.waist}. `;
      if (user_profile.hip) queryText += `Hip is ${user_profile.hip}. `;
    }
    if (clothing_item) {
      queryText += `Looking for recommendations for a ${clothing_item.color || ''} ${clothing_item.type || ''}. `;
    }
    if (occasion) {
      queryText += `Occasion is ${occasion}. `;
    }

    if (!queryText.trim()) {
      return NextResponse.json({ recommendation: "Please provide user profile or clothing item details." });
    }

    const featureExtractor = await getExtractor();
    const queryEmbeddingOutput = await featureExtractor(queryText, { pooling: 'mean', normalize: true });
    const queryEmbedding = Array.from(queryEmbeddingOutput.data) as number[];

    // Perform similarity search
    const similarities = documentEmbeddings.map((docEmbed, index) => ({
      index,
      similarity: cosineSimilarity(queryEmbedding, docEmbed),
    }));

    // Sort by similarity and get top K documents
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topK = 2; // Retrieve top 2 relevant documents
    const retrievedDocuments = similarities.slice(0, topK).map(s => documents[s.index]);

    let finalRecommendation = "";
    if (retrievedDocuments.length > 0) {
      finalRecommendation = "Based on relevant information: " + retrievedDocuments.join(" ");
    } else {
      finalRecommendation = "No specific recommendations found based on the provided details.";
    }

    return NextResponse.json({ recommendation: finalRecommendation });

  } catch (error) {
    console.error("Error in RAG recommendation API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
