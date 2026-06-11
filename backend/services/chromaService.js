import { ChromaClient } from 'chromadb';

const client = new ChromaClient();

export const initializeCollections = async () => {
  try {
    const collections = ['resumes', 'interviews', 'questions', 'career_paths'];
    
    for (const collectionName of collections) {
      try {
        await client.getOrCreateCollection({ name: collectionName });
        console.log(`Collection ${collectionName} ready`);
      } catch (error) {
        console.error(`Error creating collection ${collectionName}:`, error);
      }
    }
  } catch (error) {
    console.error('Error initializing ChromaDB:', error);
  }
};

export const storeResumeEmbedding = async (resumeId, text, metadata) => {
  try {
    const collection = await client.getCollection({ name: 'resumes' });
    await collection.add({
      ids: [resumeId],
      metadatas: [metadata],
      documents: [text]
    });
    return true;
  } catch (error) {
    console.error('Error storing resume embedding:', error);
    return false;
  }
};

export const searchSimilarResumes = async (query, nResults = 5) => {
  try {
    const collection = await client.getCollection({ name: 'resumes' });
    const results = await collection.query({
      queryTexts: [query],
      nResults
    });
    return results;
  } catch (error) {
    console.error('Error searching resumes:', error);
    return null;
  }
};

export const storeInterviewQuestions = async (questions, metadata) => {
  try {
    const collection = await client.getCollection({ name: 'questions' });
    const ids = questions.map((_, index) => `q_${Date.now()}_${index}`);
    
    await collection.add({
      ids,
      metadatas: questions.map(() => metadata),
      documents: questions
    });
    return true;
  } catch (error) {
    console.error('Error storing interview questions:', error);
    return false;
  }
};