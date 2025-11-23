-- Seed data for Global SaaS Catalog
-- Uses Clearbit API for logos: https://logo.clearbit.com/{domain}

INSERT INTO saas_products (name, website_url, logo_url, category, description, status, default_cost) VALUES
-- ENTERTAINMENT
('Netflix', 'netflix.com', 'https://logo.clearbit.com/netflix.com', 'Entertainment', 'Streaming service for movies, TV shows, and documentaries.', 'verified', 15.49),
('Spotify', 'spotify.com', 'https://logo.clearbit.com/spotify.com', 'Entertainment', 'Digital music, podcast, and video service.', 'verified', 11.99),
('Disney+', 'disneyplus.com', 'https://logo.clearbit.com/disneyplus.com', 'Entertainment', 'Streaming home of Disney, Pixar, Marvel, Star Wars, and National Geographic.', 'verified', 13.99),
('YouTube Premium', 'youtube.com', 'https://logo.clearbit.com/youtube.com', 'Entertainment', 'Ad-free YouTube, background play, and downloads.', 'verified', 13.99),
('Amazon Prime', 'amazon.com', 'https://logo.clearbit.com/amazon.com', 'Entertainment', 'Fast shipping, streaming, and reading benefits.', 'verified', 14.99),
('Apple Music', 'music.apple.com', 'https://logo.clearbit.com/apple.com', 'Entertainment', 'Stream over 100 million songs ad-free.', 'verified', 10.99),
('Hulu', 'hulu.com', 'https://logo.clearbit.com/hulu.com', 'Entertainment', 'Streaming TV and movies.', 'verified', 7.99),

-- PRODUCTIVITY & AI
('Notion', 'notion.so', 'https://logo.clearbit.com/notion.so', 'Productivity', 'All-in-one workspace for notes, tasks, wikis, and databases.', 'verified', 10.00),
('ChatGPT Plus', 'openai.com', 'https://logo.clearbit.com/openai.com', 'AI', 'Access to GPT-4, faster response times, and exclusive features.', 'verified', 20.00),
('Claude Pro', 'anthropic.com', 'https://logo.clearbit.com/anthropic.com', 'AI', '5x more usage of Claude 3 Opus and Haiku.', 'verified', 20.00),
('Perplexity Pro', 'perplexity.ai', 'https://logo.clearbit.com/perplexity.ai', 'AI', 'AI-powered search engine with pro features.', 'verified', 20.00),
('Todoist', 'todoist.com', 'https://logo.clearbit.com/todoist.com', 'Productivity', 'The world''s #1 task manager and to-do list app.', 'verified', 5.00),
('Slack', 'slack.com', 'https://logo.clearbit.com/slack.com', 'Communication', 'Team communication and collaboration platform.', 'verified', 8.75),
('Google Workspace', 'workspace.google.com', 'https://logo.clearbit.com/google.com', 'Productivity', 'Professional email, online storage, shared calendars, and video meetings.', 'verified', 6.00),
('Microsoft 365', 'microsoft.com', 'https://logo.clearbit.com/microsoft.com', 'Productivity', 'Premium Office apps, extra cloud storage, and advanced security.', 'verified', 6.99),

-- DESIGN
('Figma', 'figma.com', 'https://logo.clearbit.com/figma.com', 'Design', 'Collaborative interface design tool.', 'verified', 15.00),
('Canva', 'canva.com', 'https://logo.clearbit.com/canva.com', 'Design', 'Free-to-use online graphic design tool.', 'verified', 14.99),
('Adobe Creative Cloud', 'adobe.com', 'https://logo.clearbit.com/adobe.com', 'Design', 'Collection of 20+ desktop and mobile apps for photography, design, video, web, UX, and more.', 'verified', 59.99),
('Framer', 'framer.com', 'https://logo.clearbit.com/framer.com', 'Design', 'The web builder for creative pros.', 'verified', 20.00),
('Webflow', 'webflow.com', 'https://logo.clearbit.com/webflow.com', 'Design', 'Build custom websites visually without code.', 'verified', 18.00),

-- DEVELOPER
('GitHub Copilot', 'github.com', 'https://logo.clearbit.com/github.com', 'Developer', 'Your AI pair programmer.', 'verified', 10.00),
('Vercel', 'vercel.com', 'https://logo.clearbit.com/vercel.com', 'Developer', 'Develop. Preview. Ship. For the best frontend experience.', 'verified', 20.00),
('Cursor', 'cursor.com', 'https://logo.clearbit.com/cursor.com', 'Developer', 'The AI Code Editor.', 'verified', 20.00),
('Linear', 'linear.app', 'https://logo.clearbit.com/linear.app', 'Developer', 'A better way to build products.', 'verified', 10.00),
('JetBrains All Products', 'jetbrains.com', 'https://logo.clearbit.com/jetbrains.com', 'Developer', 'Complete toolkit for developers.', 'verified', 28.90),

-- UTILITIES
('1Password', '1password.com', 'https://logo.clearbit.com/1password.com', 'Utilities', 'Password manager, digital vault, form filler and secure digital wallet.', 'verified', 2.99),
('NordVPN', 'nordvpn.com', 'https://logo.clearbit.com/nordvpn.com', 'Utilities', 'Leading VPN service for speed and security.', 'verified', 12.99),
('Dropbox', 'dropbox.com', 'https://logo.clearbit.com/dropbox.com', 'Utilities', 'Secure cloud storage and file sharing.', 'verified', 11.99),
('Zoom', 'zoom.us', 'https://logo.clearbit.com/zoom.us', 'Communication', 'Video conferencing, cloud phone, and webinars.', 'verified', 15.99);

