import type { Platform } from './types.js';

/**
 * Detect the video platform from a URL.
 *
 * @param url - The video URL to inspect.
 * @returns The detected platform, or `null` if unrecognised.
 */
export function detectPlatform(url: string): Platform | null {
	try {
		const urlObj = new URL(url);
		const hostname = urlObj.hostname.toLowerCase();

		if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
			return 'youtube';
		}
		if (hostname.includes('vimeo.com')) {
			return 'vimeo';
		}
		// PeerTube instances use path-based detection
		if (url.includes('/videos/watch/') || url.includes('/w/')) {
			return 'peertube';
		}

		return null;
	} catch {
		return null;
	}
}

/**
 * Extract the video ID from a YouTube URL.
 *
 * Supports watch, embed, short-link, /v/, and /shorts/ formats.
 *
 * @param url - A YouTube video URL.
 * @returns The video ID string, or `null` if extraction fails.
 */
export function extractYouTubeId(url: string): string | null {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
		/youtube\.com\/v\/([^&?/]+)/,
		/youtube\.com\/shorts\/([^&?/]+)/,
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match?.[1]) {
			return match[1];
		}
	}

	return null;
}
