export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { filename, contentBase64 } = req.body;
        if (!filename || !contentBase64) {
            return res.status(400).json({ error: 'Missing filename or contentBase64' });
        }

        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        if (!GITHUB_TOKEN) {
            return res.status(500).json({ error: 'Server configuration error: Missing GITHUB_TOKEN env variable in Vercel' });
        }

        const OWNER = 'ArthurNoob69';
        const REPO = 'PixieeAccounts';
        const PATH = `pdfs/${filename}`;

        // 1. Check if file already exists to get its SHA (needed for updates)
        const getUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;
        const getResponse = await fetch(getUrl, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'PixieeAccounts-App'
            }
        });

        let sha = undefined;
        if (getResponse.ok) {
            const fileData = await getResponse.json();
            sha = fileData.sha;
        }

        // 2. Upload/Update the file
        const putBody = {
            message: `Upload PDF: ${filename}`,
            content: contentBase64
        };
        if (sha) {
            putBody.sha = sha;
        }

        const putResponse = await fetch(getUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'PixieeAccounts-App'
            },
            body: JSON.stringify(putBody)
        });

        if (!putResponse.ok) {
            const errorData = await putResponse.text();
            console.error('GitHub API Error:', errorData);
            return res.status(502).json({ error: 'Failed to upload to GitHub API' });
        }

        // Return the GitHub Pages URL
        const fileUrl = `https://${OWNER}.github.io/${REPO}/${PATH}`;
        
        return res.status(200).json({ url: fileUrl });

    } catch (error) {
        console.error('Upload Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
