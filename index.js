const express = require('express');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/lighthouse', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { logLevel: 'info', output: 'json', onlyCategories: ['performance'], port: chrome.port };
    const runnerResult = await lighthouse(url, options);

    await chrome.kill();

    return res.json(runnerResult.lhr);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
