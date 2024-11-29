import puppeteer from "puppeteer"

interface YouTubeVideoData {
	title: string
	views: string
	likes: string
	description: string
	channelName: string
	publishDate: string
}

export async function getYouTubeVideoData(url: string): Promise<YouTubeVideoData> {
	const browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	})

	try {
		const page = await browser.newPage()
		await page.goto(url, { waitUntil: "networkidle0" })

		await page.waitForSelector("h1.style-scope.ytd-video-primary-info-renderer")

		const videoData = await page.evaluate(() => {
			const title = document.querySelector("h1.style-scope.ytd-video-primary-info-renderer")?.textContent?.trim()
			const views = document.querySelector("#count .view-count")?.textContent?.trim()
			const likes = document.querySelector("#top-level-buttons-computed ytd-toggle-button-renderer:first-child #text")?.textContent?.trim()
			const description = document.querySelector("#description-inline-expander #content")?.textContent?.trim()
			const channelName = document.querySelector("#owner #channel-name a")?.textContent?.trim()
			const publishDate = document.querySelector("#info-strings yt-formatted-string")?.textContent?.trim()

			return {
				title: title || "Unknown Title",
				views: views || "Unknown Views",
				likes: likes || "Unknown Likes",
				description: description || "No description available",
				channelName: channelName || "Unknown Channel",
				publishDate: publishDate || "Unknown Date",
			}
		})

		return videoData
	} finally {
		await browser.close()
	}
}

interface TranscriptData {
	text: string
	baseUrl: string
	rawTranscript: string
}

export async function getYouTubeVideoTranscript(url: string): Promise<TranscriptData> {
	const browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	})

	try {
		const page = await browser.newPage()

		// Enable request interception to capture network requests
		await page.setRequestInterception(true)

		let captionsUrl: string | null = null

		page.on("request", (request) => {
			request.continue()
		})

		page.on("response", async (response) => {
			const url = response.url()
			if (url.includes("/watch")) {
				try {
					const text = await response.text()
					const match = text.match(/"captionTracks":\[\{"baseUrl":"([^"]+)"/)
					if (match && match[1]) {
						captionsUrl = match[1].replace(/\\u0026/g, "&")
					}
				} catch (error) {
					console.error("Error processing response:", error)
				}
			}
		})

		await page.goto(url, { waitUntil: "networkidle0" })

		// Wait a bit to ensure we've captured all necessary network requests
		await new Promise((resolve) => setTimeout(resolve, 2000))
		// await page.waitForTimeout(2000)

		if (!captionsUrl) {
			throw new Error("Could not find captions URL")
		}

		// Fetch the transcript data
		const transcriptResponse = await fetch(captionsUrl)
		const transcriptData = await transcriptResponse.text()

		return {
			text: "Transcript extracted successfully",
			baseUrl: captionsUrl,
			rawTranscript: transcriptData,
		}
	} finally {
		await browser.close()
	}
}
