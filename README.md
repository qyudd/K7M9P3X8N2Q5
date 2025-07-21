# AI Knowledge Verification Test

This project is a web application that tests and evaluates an AI's knowledge of a given work (e.g., a book, movie, or game) through a two-step verification process.

**Live Demo:** **[https://qyudd.github.io/K7M9P3X8N2Q5/](https://qyudd.github.io/K7M9P3X8N2Q5/)**

## How It Works

This application uses the Gemini API to perform a two-step analysis:

1.  **Step 1: Internal Knowledge Output:** The AI first describes everything it knows about the given topic based solely on its internal training data, without accessing the web.
2.  **Step 2: Web-Verified Self-Correction:** The AI then uses Google Search to find up-to-date information and compares it against its Step 1 output. It identifies any errors, omissions, or outdated information and provides a self-evaluation score out of 10.

## How to Run Locally

**Prerequisites:**
*   Node.js

**Instructions:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/qyudd/K7M9P3X8N2Q5.git
    cd K7M9P3X8N2Q5
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

4.  **Use the App:**
    Open the application in your browser, enter your Gemini API key, and start testing! Your API key is stored only in your browser's local storage.

## Deployment

This project is deployed on GitHub Pages. The `npm run deploy` script builds the application and pushes the contents of the `dist` directory to the `gh-pages` branch.
