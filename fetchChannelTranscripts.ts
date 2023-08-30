import { fetchVideosFromChannel } from './fetchChannelMetadata';
import { youtubeVideoScraper } from './fetchVideoTranscript';
import * as fs from 'fs';

async function fetchTranscriptsFromChannel(channelURL: string) {
    try {
        // 1. Get all the video links from the provided YouTube channel URL.
        const videos = await fetchVideosFromChannel(channelURL);

        if (videos.length === 0) {
            console.error('No videos found for the channel.');
            return [];
        }

        // Retrieve channel name from the first video's channel property.
        const channelName = videos[0].channel;

        // Store the results.
        let results: Array<{ channel: string, title: string, link: string, content: string }> = [];

        // 2. Loop through each video link.
        for (const video of videos) {
            try {
                // 3. Get the transcript for each video link.
                const transcriptResult = await youtubeVideoScraper(video.link);
                results.push({
                    channel: channelName,
                    title: video.title,
                    link: video.link,
                    content: transcriptResult.content
                });
            } catch (error) {
                console.error(`Failed to get transcript for video: ${video.link}`);
            }
        }

        // Save results to a JSON file
        const filename = `transcripts_${channelName}_${new Date().toISOString().split('T')[0]}.json`;
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

// // Example usage:
// fetchTranscriptsFromChannel('https://www.youtube.com/@Finaius')
//     .then(results => {
//         // Do something with the results. For now, they are saved to a file.
//     })
//     .catch(error => {
//         console.error(`Failed to fetch transcripts: ${error}`);
//     });
