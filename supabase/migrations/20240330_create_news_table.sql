-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create an index on timestamp for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_timestamp ON articles(timestamp DESC); 