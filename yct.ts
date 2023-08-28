import { fetchVideosFromChannel } from './yts';
import { youtubeVideoScraper } from './yt';
import * as fs from 'fs';

async function fetchTranscriptsFromChannel(channelURL: string) {
    try {
        // 1. Get all the video links from the provided YouTube channel URL.
        const videos = await fetchVideosFromChannel(channelURL);

        // Store the results.
        let results: Array<{ link: string, content: string }> = [];

        // 2. Loop through each video link.
        for (const video of videos) {
            try {
                // 3. Get the transcript for each video link.
                const transcriptResult = await youtubeVideoScraper(video.link);
                results.push({
                    link: video.link,
                    content: transcriptResult.content
                });
            } catch (error) {
                console.error(`Failed to get transcript for video: ${video.link}`);
            }
        }

        // Save results to a JSON file
        const filename = `transcripts_${new Date().toISOString().split('T')[0]}.json`;
        fs.writeFileSync(filename, JSON.stringify(results, null, 2));
        console.log(`Results saved to ${filename}`);

        return results;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Failed due to error: ${error.message}`);
        } else {
            console.error('Failed due to an unknown error.');
        }
        return [];
    }
}

// Example usage:
fetchTranscriptsFromChannel('https://www.youtube.com/@Finaius')
    .then(results => {
        // Do something with the results. For now, they are saved to a file.
    })
    .catch(error => {
        console.error(`Failed to fetch transcripts: ${error}`);
    });
