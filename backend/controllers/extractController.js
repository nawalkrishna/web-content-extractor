const axios = require('axios');
const cheerio = require('cheerio');

exports.extractContent = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Validate URL format
        new URL(url);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000 // 10 seconds timeout
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Remove unnecessary elements
        $('script, style, noscript, iframe, link, meta, nav, footer, header, aside, .advertisement, .ad, .sidebar, .cookie, .popup').remove();

        const title = $('title').text().trim() || 'No Title Found';

        // Extract metadata
        const description = $('meta[name="description"]').attr('content') || '';
        const author = $('meta[name="author"]').attr('content') || '';
        const keywords = $('meta[name="keywords"]').attr('content') || '';

        // Extract structured content
        const structuredContent = [];

        // Try to find main content area
        const mainContent = $('main, article, .content, .main-content, #content, #main').first();
        const contentArea = mainContent.length > 0 ? mainContent : $('body');

        // Extract headings and their content
        contentArea.find('h1, h2, h3, h4, h5, h6').each((i, elem) => {
            const heading = $(elem);
            const level = elem.name;
            const text = heading.text().trim();

            if (text) {
                structuredContent.push({
                    type: 'heading',
                    level: level,
                    text: text
                });
            }
        });

        // Extract paragraphs
        contentArea.find('p').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text && text.length > 20) { // Only include substantial paragraphs
                structuredContent.push({
                    type: 'paragraph',
                    text: text
                });
            }
        });

        // Extract lists
        contentArea.find('ul, ol').each((i, elem) => {
            const listItems = [];
            $(elem).find('li').each((j, li) => {
                const text = $(li).clone().children('ul, ol').remove().end().text().trim();
                if (text) {
                    listItems.push(text);
                }
            });
            if (listItems.length > 0) {
                structuredContent.push({
                    type: elem.name === 'ul' ? 'unordered-list' : 'ordered-list',
                    items: listItems
                });
            }
        });

        // Extract code blocks
        contentArea.find('pre, code').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text && text.length > 10) {
                structuredContent.push({
                    type: 'code',
                    text: text
                });
            }
        });

        // Fallback: plain text content
        let textContent = contentArea.text();
        textContent = textContent.replace(/\s+/g, ' ').trim();

        // Format structured content as readable text
        let formattedContent = '';
        structuredContent.forEach((item, index) => {
            switch (item.type) {
                case 'heading':
                    const level = parseInt(item.level.charAt(1));
                    formattedContent += `\n${'='.repeat(60 - level * 5)}\n`;
                    formattedContent += `${item.text.toUpperCase()}\n`;
                    formattedContent += `${'='.repeat(60 - level * 5)}\n\n`;
                    break;
                case 'paragraph':
                    formattedContent += `${item.text}\n\n`;
                    break;
                case 'unordered-list':
                    item.items.forEach(listItem => {
                        formattedContent += `  • ${listItem}\n`;
                    });
                    formattedContent += '\n';
                    break;
                case 'ordered-list':
                    item.items.forEach((listItem, idx) => {
                        formattedContent += `  ${idx + 1}. ${listItem}\n`;
                    });
                    formattedContent += '\n';
                    break;
                case 'code':
                    formattedContent += `\n[CODE BLOCK]\n${item.text}\n[/CODE BLOCK]\n\n`;
                    break;
            }
        });

        // Calculate statistics
        const wordCount = textContent.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/min

        res.json({
            url,
            title,
            description,
            author,
            keywords,
            content: formattedContent || textContent,
            structuredContent: structuredContent,
            statistics: {
                wordCount,
                characterCount: textContent.length,
                readingTime: `${readingTime} min`,
                paragraphs: structuredContent.filter(item => item.type === 'paragraph').length,
                headings: structuredContent.filter(item => item.type === 'heading').length,
                lists: structuredContent.filter(item => item.type.includes('list')).length,
                codeBlocks: structuredContent.filter(item => item.type === 'code').length
            },
            extractedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Extraction Error:', error.message);

        let errorMessage = 'Failed to extract content';
        if (error.code === 'ERR_INVALID_URL') {
            errorMessage = 'Invalid URL format';
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = 'Request timed out';
        } else if (error.response) {
            errorMessage = `Failed to fetch page: ${error.response.statusText}`;
        }

        res.status(500).json({ error: errorMessage });
    }
};
