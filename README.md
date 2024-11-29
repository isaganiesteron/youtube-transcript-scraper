# YouTube Video Data & Transcript API

A Next.js API that extracts video information and transcripts from YouTube videos. This API uses Puppeteer for web scraping and provides authenticated endpoints for retrieving video metadata and transcripts.

## Features

-   🔒 API Key authentication
-   📊 Video metadata extraction (title, views, likes, etc.)
-   📝 Transcript extraction and parsing
-   🔄 XML to readable text conversion
-   ⚡ TypeScript support
-   🚀 Built with Next.js

## Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn
-   A YouTube video URL

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd youtube-video-api
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:

```env
API_KEY=your-secret-api-key-here
```

## Project Structure

```
src/
├── app/
│   └── api/
│       └── process/
│           └── route.ts
├── types/
│   ├── api.ts
│   └── transcript.ts
└── utils/
    ├── puppeteer.ts
    ├── transcript.ts
    └── validation.ts
```

## API Endpoints

### POST /api/process

Extracts video data and transcript from a YouTube video.

#### Request Headers

```
Content-Type: application/json
x-api-key: your-secret-api-key
```

#### Request Body

```json
{
	"url": "https://www.youtube.com/watch?v=video-id"
}
```

#### Response

```json
{
	"success": true,
	"processedUrl": "https://www.youtube.com/watch?v=video-id",
	"timestamp": "2024-11-29T12:00:00.000Z",
	"videoData": {
		"title": "Video Title",
		"views": "1,234,567 views",
		"likes": "12.3K",
		"description": "Video description...",
		"channelName": "Channel Name",
		"publishDate": "Nov 29, 2024"
	},
	"transcriptData": {
		"text": "Full transcript text...",
		"baseUrl": "caption-url",
		"segments": [
			{
				"start": 0.08,
				"duration": 4.48,
				"text": "Transcript segment..."
			}
		]
	}
}
```

## Usage Example

Using curl:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key" \
  -d '{"url":"https://www.youtube.com/watch?v=video-id"}' \
  http://localhost:3000/api/process
```

Using TypeScript/JavaScript:

```typescript
const response = await fetch("http://localhost:3000/api/process", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"x-api-key": "your-secret-api-key",
	},
	body: JSON.stringify({
		url: "https://www.youtube.com/watch?v=video-id",
	}),
})

const data = await response.json()
```

## Development

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. The API will be available at `http://localhost:3000/api/process`

## Deployment

1. Build the application:

```bash
npm run build
# or
yarn build
```

2. Start the production server:

```bash
npm start
# or
yarn start
```

## Important Notes

-   Ensure your deployment environment supports Puppeteer
-   Some hosting platforms may require additional configuration for Puppeteer
-   Not all YouTube videos have available transcripts
-   Respect YouTube's terms of service when using this API

## Error Handling

The API returns appropriate HTTP status codes:

-   200: Success
-   400: Invalid request (bad URL format)
-   401: Invalid API key
-   500: Server error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
