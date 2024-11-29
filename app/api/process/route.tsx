// src/app/api/process/route.js
import { NextResponse } from "next/server"

import { RequestBody, ApiResponse } from "@/types/api"
import { getYouTubeVideoTranscript } from "@/utils/puppeteer"
import { isValidYouTubeUrl } from "@/utils/validation"
import { parseTranscript } from "@/utils/transcript"

export async function POST(request: Request): Promise<NextResponse> {
	try {
		// Get API key from headers
		const apiKey = request.headers.get("x-api-key")

		// Check if API key is valid
		if (apiKey !== process.env.API_KEY) {
			return NextResponse.json({ error: "Unauthorized - Invalid API key" }, { status: 401 })
		}

		// Parse request body
		const body: RequestBody = await request.json()

		// Validate URL in request body
		if (!body.url || typeof body.url !== "string") {
			return NextResponse.json({ error: "Bad Request - URL is required and must be a string" }, { status: 400 })
		}

		// Validate URL
		if (!body.url || !isValidYouTubeUrl(body.url)) {
			return NextResponse.json({ error: "Bad Request - Invalid YouTube URL" }, { status: 400 })
		}

		// Get Youtube transcripts
		const transcriptData = await getYouTubeVideoTranscript(body.url)
		const transcript = await parseTranscript(transcriptData.rawTranscript)

		const response: ApiResponse = {
			success: true,
			processedUrl: body.url,
			timestamp: new Date().toISOString(),
			transcript: transcript.formattedText,
		}

		return NextResponse.json(response)
	} catch (error: any) {
		return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 })
	}
}
