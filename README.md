# MediScan AI — Intelligent Medical Report Analyzer

A browser-based MVP for the Healthcare & MedTech problem statement. It lets a user enter laboratory test results and the reference ranges printed on their report, flags values outside those ranges, displays a summary dashboard, applies a small set of illustrative pattern checks, and exports a CSV summary.

## Run locally
No build step or API key is needed.

1. Download and unzip the project.
2. Open `index.html` in a modern browser, or run a local server:
   - Python: `python3 -m http.server 8000`
   - Open `http://localhost:8000`

## Features
- Editable laboratory result table and sample data
- Range-based high/low/within-range flags
- Simple illustrative checks for elevated glucose, low hemoglobin, high LDL, and selected combinations
- Responsive dashboard and CSV export
- Browser-only processing; no server upload or persistence

## Technologies
- HTML5
- CSS3 (responsive layout)
- Vanilla JavaScript
- Browser Blob / download API for CSV export

## AI tools
If you used ChatGPT to help create, debug, or document this project, list ChatGPT as a development assistant in your submission. **This MVP does not call an AI model or external API.** Do not claim an AI API integration unless you add and test one.

## Deployment
This is a static website. You can deploy the project folder using:
- **Netlify:** drag and drop the unzipped folder in Netlify's manual deploy area.
- **Vercel:** import the GitHub repository as a project; no build command is needed and the output/root directory is the project root.
- **GitHub Pages:** push the files to a repository and enable Pages for the main branch/root.

After deployment, add the real live URL and GitHub URL to your project submission. Record a demo using the deployed site.

## Suggested demo walkthrough
1. Open the application and point out the sample results.
2. Click **Load sample report** if needed.
3. Click **Analyze report**.
4. Show the result cards and flagged indicators.
5. Point out the pattern-review notes and educational disclaimer.
6. Click **Export summary** to download the CSV.

## Limitations and safety
- This is a prototype and not a medical device or diagnostic tool.
- It does not parse uploaded PDF/image reports; values are entered manually.
- Reference ranges are user-provided and must match the original laboratory report, including units and applicable patient context.
- The pattern checks are illustrative, not validated clinical rules.
- No user data is sent to a server by this demo, but it has not undergone a formal security or privacy audit.
- Never use it to make treatment decisions or delay urgent medical care.
