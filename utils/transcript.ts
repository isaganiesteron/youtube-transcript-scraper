import { parseString } from "xml2js"
import { promisify } from "util"

interface TranscriptSegment {
	start: number
	duration: number
	text: string
}

const parseXmlAsync = promisify(parseString)

export async function parseTranscript(xmlContent: string): Promise<{
	plainText: string
	formattedText: string
	segments: TranscriptSegment[]
}> {
	try {
		// Parse XML
		const result: any = await parseXmlAsync(xmlContent)

		if (!result.transcript || !result.transcript.text) {
			throw new Error("Invalid transcript format")
		}

		// Convert each text segment
		const segments: TranscriptSegment[] = result.transcript.text.map((item: any) => ({
			start: parseFloat(item.$.start),
			duration: parseFloat(item.$.dur),
			text: item._.trim().replace(/&amp;#39;/g, "'"), // Convert HTML entities
		}))

		// Create plain text version (just the text)
		const plainText = segments.map((segment) => segment.text).join(" ")

		// Create formatted version with timestamps
		const formattedText = segments
			.map((segment) => {
				const minutes = Math.floor(segment.start / 60)
				const seconds = Math.floor(segment.start % 60)
				const timestamp = `[${minutes}:${seconds.toString().padStart(2, "0")}]`
				return `${timestamp} ${segment.text}`
			})
			.join("\n")

		return {
			plainText,
			formattedText,
			segments,
		}
	} catch (error) {
		console.error("Error parsing transcript:", error)
		throw new Error("Failed to parse transcript XML")
	}
}
