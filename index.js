const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Add a route to handle favicon requests
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

app.get('/', (req, res) => {
    res.send('Lighthouse Backend is running');
});

app.post('/lighthouse', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const lighthouse = await import('lighthouse');
        const chromeLauncher = await import('chrome-launcher');

        const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
        const options = { logLevel: 'info', output: 'json', onlyCategories: ['performance'], port: chrome.port };
        const runnerResult = await lighthouse.default(url, options);

        await chrome.kill();

        return res.json(runnerResult.lhr);
    } catch (error) {
        console.error('Error details:', error);
        return res.status(500).json({ error: 'An error occurred while running Lighthouse', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
