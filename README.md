# Google Drive MCP

This project connects Claude Desktop to your Google Drive via the Model Context Protocol (MCP), allowing Claude to access and interact with your Drive files and folders securely.

## Supported MCP tools

These tools are exposed to Claude Desktop via MCP. Names below are the exact tool identifiers.

- `list-all-folders` (no params): Lists all folders in your Drive.
- `list-files-in-folder` (`folderId: string`): Lists files inside a specific folder.
- `list-shared-with-me` (no params): Lists files and folders that other users shared with you.
- `get-file-download-link` (`fileId: string`): Returns a direct download link and an online view link for a file.
- `get-file-metadata` (`fileId: string`): Returns detailed file metadata (size, type, owners, created/modified timestamps, sharing status).
- `get-file-revisions` (`fileId: string`): Returns file revision history with modification times and who modified each revision.

Typical flow: `list-all-folders` → `list-files-in-folder` → (`get-file-metadata` / `get-file-download-link` / `get-file-revisions`).

## Setup and Usage

Follow these steps in order to get the app running:

1. **Get Google OAuth Credentials**

   - Go to the [Google Cloud Console Credentials page](https://console.cloud.google.com/apis/credentials) to create a project and enable the Google Drive API.
   - Create **OAuth 2.0 Client IDs** credentials with application type **Desktop app**.
   - Note your **Client ID**, **Client Secret**, and set your **Redirect URI** to `http://localhost:3000`.

2. **Create a `.env` File**

   In the root of your project, create a `.env` file and add the following variables:

```
CLIENT_ID=your-client-id-here
CLIENT_SECRET=your-client-secret-here
REDIRECT_URI=http://localhost:3000
```

Optional:

```
GOOGLE_DRIVE_TOKEN_PATH=/absolute/path/to/token.json
```

## Resources (optional)

This server also exposes MCP Resources for clients that prefer `resources/read` over tools:

- `gdrive://file/{fileId}/metadata` (JSON)
- `gdrive://file/{fileId}/content` (text, when supported)
- `gdrive://folder/{folderId}/files` (JSON)

3. **Install Dependencies**

```
npm install
```

4. **Generate Google API Token**

```
npm run tokenGenerator
```

This will open a browser to authenticate with Google and save a token.json file in your project root.

5. **Build the project**

```
npm run build
```

6. **Install Claude Desktop (if not already installed)**
   
   Download and install Claude Desktop from https://claude.ai/download.

7. **Configure Claude Desktop MCP Servers**

   In a text editor open the Claude Desktop config file at:

   macOS/Linux:
   ```
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```

   Windows:
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

Add the following MCP server configuration, adjusting the path to your build output and environment variables accordingly:

```
{
  "mcpServers": {
    "googleDrive": {
      "command": "node",
      "args": ["path/to/your/build/index.js"],
      "env": {
        "CLIENT_ID": "your-actual-client-id",
        "CLIENT_SECRET": "your-actual-client-secret",
        "REDIRECT_URI": "http://localhost:3000"
      }
    }
  }
}
```

If you use indirection, you can either:

If you prefer, you can also pass credentials as CLI args (not recommended for long-term use):

```
node build/index.js --client-id "..." --client-secret "..." --redirect-uri "http://localhost:3000"
```

Run `node build/index.js --help` to see all supported flags.
Save the file

8. **Restart Claude Desktop**
