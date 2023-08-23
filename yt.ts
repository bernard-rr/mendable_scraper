import { YoutubeTranscript } from 'youtube-transcript';

type VideoScraperResult = {
    content: string;
    source: string;
};

async function youtubeVideoScraper(url: string): Promise<VideoScraperResult> {
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

function isValidYoutubeURL(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/watch\?v=[^&]+/;
    return youtubeRegex.test(url);
}

// Example Usage
const videoURL = 'https://www.youtube.com/watch?v=rYMTSfL_kTk';
youtubeVideoScraper(videoURL).then(console.log).catch(console.error);
