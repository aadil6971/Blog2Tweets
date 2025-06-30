# Blog2Tweets

A Chrome extension that extracts key points from any webpage using OpenAI embeddings and generates a customizable number of engaging tweet drafts. Click any draft to open Twitter’s composer with it pre‑filled.

## 🔧 Prerequisites

* Google Chrome (v91 or later)
* An OpenAI API key (starts with `sk-...`)

## 🚀 Installation & Setup

1. **Download the repository**

   * Click **Code** ▶ **Download ZIP** or clone via Git:

     ```bash
     git clone https://github.com/aadil6971/blog2tweets.git
     ```
   * Extract/unzip if needed.

2. **Open Chrome Extensions**

   * In your browser address bar, go to `chrome://extensions`
   * Enable **Developer mode** (switch in top-right).

3. **Load Unpacked Extension**

   * Click **Load unpacked** button.
   * In the dialog, navigate to the folder containing this project and select it.
   * You should now see **Blog2Tweets** in your extensions list.

4. **Configure API Key & Tweet Count**

   * Click the extension’s icon in the toolbar.
   * Select the **Settings** tab.
   * Paste your OpenAI API key into the **API Key** field.
   * Enter the desired **Number of Tweets** to generate per page.
   * Click **Save Settings** (you’ll see a confirmation message).

5. **Generate Tweets**

   * Navigate to any webpage you’d like to summarize (e.g. a blog post).
   * Click the extension icon ▶ **Generate** tab.
   * Click **Analyze & Generate**.
   * Wait a few seconds for processing—your tweet drafts will appear.
   * Click any tweet to open Twitter’s composer with the text pre‑filled.

## 🔄 Updating or Uninstalling

* **Update**: Pull the latest code and click **Reload** on `chrome://extensions` for the extension.
* **Uninstall**: In `chrome://extensions`, click **Remove** under this extension.

## 📝 License

MIT © 
