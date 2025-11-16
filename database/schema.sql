-- Enable pgvector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Resources table for scholarships, visa info, jobs
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  category TEXT NOT NULL CHECK (category IN ('scholarship', 'visa', 'job', 'accommodation', 'general')),
  country TEXT DEFAULT 'Canada',
  institution TEXT,
  deadline DATE,
  eligibility TEXT,
  amount TEXT,
  tags TEXT[],
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Embeddings table for RAG
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding VECTOR(1536)
);

-- Create index for vector similarity search
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Full-text search index on resources
CREATE INDEX resources_search_idx ON resources USING GIN (
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- Function for similarity search
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- Sample data
INSERT INTO resources (title, description, url, category, institution, deadline, tags) VALUES
('Lester B. Pearson International Scholarship', 'Full-ride scholarship for international students at University of Toronto covering tuition, books, incidental fees, and residence support.', 'https://future.utoronto.ca/pearson/', 'scholarship', 'University of Toronto', '2026-01-15', ARRAY['full-tuition', 'undergraduate', 'high-achiever']),
('Canada Student Visa Guide', 'Complete guide to applying for Canadian study permit including required documents, processing times, and biometrics information.', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html', 'visa', 'IRCC', NULL, ARRAY['study-permit', 'documentation', 'official']),
('Part-time Jobs for International Students', 'International students can work up to 20 hours per week during academic sessions and full-time during breaks without a work permit.', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work.html', 'job', 'IRCC', NULL, ARRAY['part-time', 'work-permit', 'regulations']);
