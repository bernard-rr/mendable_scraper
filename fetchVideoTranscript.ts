import { YoutubeTranscript } from 'youtube-transcript';

type VideoScraperResult = {
    content: string;
    source: string;
};

export async function youtubeVideoScraper(url: string): Promise<VideoScraperResult> {
    // Validate YouTube URL format
    if (!isValidYoutubeURL(url)) {
        throw new Error('Invalid YouTube URL provided.');
    }

    // Fetch the transcript
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(url);
        
        // Extract content text from the transcript
        const content = transcript.map(entry => entry.text).join(' ');
        
        return {
            content: content,
            source: url
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch transcript: ${error.message}`);
        } else {
            throw new Error('Failed to fetch transcript.');
        }
    }
}

export function isValidYoutubeURL(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=[^&]+|[A-Za-z0-9_-]+)/;
    return youtubeRegex.test(url);
}

// Example Usage
// const videoURL = 'youtube.com/watch?v=wHEIT32ZEVs';
// youtubeVideoScraper(videoURL).then(console.log).catch(console.error);
