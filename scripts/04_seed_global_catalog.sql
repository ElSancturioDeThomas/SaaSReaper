-- Seed data for Global SaaS Catalog
-- Uses Logo.dev API for logos: https://img.logo.dev/{domain}?token=pk_...
-- Note: In production, you should append your public key token: ?token=pk_YOUR_TOKEN

INSERT INTO saas_products (name, website_url, logo_url, category, description, status, default_cost) VALUES
-- ENTERTAINMENT
('Netflix', 'netflix.com', 'https://img.logo.dev/netflix.com?token=pk_public', 'Entertainment', 'Streaming service for movies, TV shows, and documentaries.', 'verified', 15.49),
('Spotify', 'spotify.com', 'https://img.logo.dev/spotify.com?token=pk_public', 'Entertainment', 'Digital music, podcast, and video service.', 'verified', 11.99),
('Disney+', 'disneyplus.com', 'https://img.logo.dev/disneyplus.com?token=pk_public', 'Entertainment', 'Streaming home of Disney, Pixar, Marvel, Star Wars, and National Geographic.', 'verified', 13.99),
('YouTube Premium', 'youtube.com', 'https://img.logo.dev/youtube.com?token=pk_public', 'Entertainment', 'Ad-free YouTube, background play, and downloads.', 'verified', 13.99),
('Amazon Prime', 'amazon.com', 'https://img.logo.dev/amazon.com?token=pk_public', 'Entertainment', 'Fast shipping, streaming, and reading benefits.', 'verified', 14.99),
('Apple Music', 'music.apple.com', 'https://img.logo.dev/apple.com?token=pk_public', 'Entertainment', 'Stream over 100 million songs ad-free.', 'verified', 10.99),
('Hulu', 'hulu.com', 'https://img.logo.dev/hulu.com?token=pk_public', 'Entertainment', 'Streaming TV and movies.', 'verified', 7.99),

-- PRODUCTIVITY & AI
('Notion', 'notion.so', 'https://img.logo.dev/notion.so?token=pk_public', 'Productivity', 'All-in-one workspace for notes, tasks, wikis, and databases.', 'verified', 10.00),
('ChatGPT Plus', 'openai.com', 'https://img.logo.dev/openai.com?token=pk_public', 'AI', 'Access to GPT-4, faster response times, and exclusive features.', 'verified', 20.00),
('Claude Pro', 'anthropic.com', 'https://img.logo.dev/anthropic.com?token=pk_public', 'AI', '5x more usage of Claude 3 Opus and Haiku.', 'verified', 20.00),
('Perplexity Pro', 'perplexity.ai', 'https://img.logo.dev/perplexity.ai?token=pk_public', 'AI', 'AI-powered search engine with pro features.', 'verified', 20.00),
('Todoist', 'todoist.com', 'https://img.logo.dev/todoist.com?token=pk_public', 'Productivity', 'The world''s #1 task manager and to-do list app.', 'verified', 5.00),
('Slack', 'slack.com', 'https://img.logo.dev/slack.com?token=pk_public', 'Communication', 'Team communication and collaboration platform.', 'verified', 8.75),
('Google Workspace', 'workspace.google.com', 'https://img.logo.dev/google.com?token=pk_public', 'Productivity', 'Professional email, online storage, shared calendars, and video meetings.', 'verified', 6.00),
('Microsoft 365', 'microsoft.com', 'https://img.logo.dev/microsoft.com?token=pk_public', 'Productivity', 'Premium Office apps, extra cloud storage, and advanced security.', 'verified', 6.99),

-- DESIGN
('Figma', 'figma.com', 'https://img.logo.dev/figma.com?token=pk_public', 'Design', 'Collaborative interface design tool.', 'verified', 15.00),
('Canva', 'canva.com', 'https://img.logo.dev/canva.com?token=pk_public', 'Design', 'Free-to-use online graphic design tool.', 'verified', 14.99),
('Adobe Creative Cloud', 'adobe.com', 'https://img.logo.dev/adobe.com?token=pk_public', 'Design', 'Collection of 20+ desktop and mobile apps for photography, design, video, web, UX, and more.', 'verified', 59.99),
('Framer', 'framer.com', 'https://img.logo.dev/framer.com?token=pk_public', 'Design', 'The web builder for creative pros.', 'verified', 20.00),
('Webflow', 'webflow.com', 'https://img.logo.dev/webflow.com?token=pk_public', 'Design', 'Build custom websites visually without code.', 'verified', 18.00),

-- DEVELOPER
('Logo.dev', 'logo.dev', 'https://img.logo.dev/logo.dev?token=pk_public', 'Developer', 'Every company logo, one simple API.', 'verified', 0.00),
('GitHub Copilot', 'github.com', 'https://img.logo.dev/github.com?token=pk_public', 'Developer', 'Your AI pair programmer.', 'verified', 10.00),
('Vercel', 'vercel.com', 'https://img.logo.dev/vercel.com?token=pk_public', 'Developer', 'Develop. Preview. Ship. For the best frontend experience.', 'verified', 20.00),
('Cursor', 'cursor.com', 'https://img.logo.dev/cursor.com?token=pk_public', 'Developer', 'The AI Code Editor.', 'verified', 20.00),
('Linear', 'linear.app', 'https://img.logo.dev/linear.app?token=pk_public', 'Developer', 'A better way to build products.', 'verified', 10.00),
('JetBrains All Products', 'jetbrains.com', 'https://img.logo.dev/jetbrains.com?token=pk_public', 'Developer', 'Complete toolkit for developers.', 'verified', 28.90),

-- UTILITIES
('1Password', '1password.com', 'https://img.logo.dev/1password.com?token=pk_public', 'Utilities', 'Password manager, digital vault, form filler and secure digital wallet.', 'verified', 2.99),
('NordVPN', 'nordvpn.com', 'https://img.logo.dev/nordvpn.com?token=pk_public', 'Utilities', 'Leading VPN service for speed and security.', 'verified', 12.99),
('Dropbox', 'dropbox.com', 'https://img.logo.dev/dropbox.com?token=pk_public', 'Utilities', 'Secure cloud storage and file sharing.', 'verified', 11.99),
('Zoom', 'zoom.us', 'https://img.logo.dev/zoom.us?token=pk_public', 'Communication', 'Video conferencing, cloud phone, and webinars.', 'verified', 15.99);

