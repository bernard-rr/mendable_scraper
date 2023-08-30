import { youtubeVideoScraper, isValidYoutubeURL } from './fetchVideoTranscript';

import { YoutubeTranscript } from 'youtube-transcript';

jest.mock('youtube-transcript');

describe('youtubeVideoScraper', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockTranscriptData = [
        { text: 'Sample content' }
    ];

    const HTTP_URL = 'http://www.youtube.com/watch?v=wHEIT32ZEVs';
    const HTTPS_URL = 'https://www.youtube.com/watch?v=wHEIT32ZEVs';
    const REGULAR_URL = 'www.youtube.com/watch?v=wHEIT32ZEVs';
    const INVALID_URL = 'https://example.com/watch?v=VIDEO_ID';
    const SHORT_URL = 'youtube.com/watch?v=wHEIT32ZEVs';

    it('should return the correct format for a valid YouTube URL with http', async () => {
        (YoutubeTranscript.fetchTranscript as jest.Mock).mockResolvedValue(mockTranscriptData);

        const result = await youtubeVideoScraper(HTTP_URL);
        expect(typeof result.content).toBeTruthy();
        expect(result.source).toBe(HTTP_URL);
    });

    it('should return the correct format for a valid YouTube URL with https', async () => {
        (YoutubeTranscript.fetchTranscript as jest.Mock).mockResolvedValue(mockTranscriptData);

        const result = await youtubeVideoScraper(HTTPS_URL);
        expect(typeof result.content).toBeTruthy();
        expect(result.source).toBe(HTTPS_URL);
    });

    it('should return the correct format for a regular YouTube URL without http or https', async () => {
        (YoutubeTranscript.fetchTranscript as jest.Mock).mockResolvedValue(mockTranscriptData);

        const result = await youtubeVideoScraper(REGULAR_URL);
        expect(typeof result.content).toBeTruthy();
        expect(result.source).toBe(REGULAR_URL);
    });

    it('should reject an invalid YouTube URL', async () => {
        expect(isValidYoutubeURL(INVALID_URL)).toBeFalsy();
    });

    it('should process a short (youtu.be) valid YouTube URL', async () => {
        expect(isValidYoutubeURL(SHORT_URL)).toBeTruthy();
    });

    it('should handle successful fetching of transcript', async () => {
        (YoutubeTranscript.fetchTranscript as jest.Mock).mockResolvedValue(mockTranscriptData);

        const result = await youtubeVideoScraper(HTTPS_URL);
        expect(typeof result.content).toBe('string');
        expect(result.source).toBe(HTTPS_URL);
    });

    it('should handle transcript fetching errors', async () => {
        (YoutubeTranscript.fetchTranscript as jest.Mock).mockRejectedValue(new Error('Fetch Error'));

        await expect(youtubeVideoScraper(HTTPS_URL)).rejects.toThrow('Failed to fetch transcript: Fetch Error');
    });

    it('should return the error message from the Error instance', async () => {
        const errorMessage = 'Some specific error';
        (YoutubeTranscript.fetchTranscript as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await expect(youtubeVideoScraper(HTTPS_URL))
            .rejects
            .toThrow(`Failed to fetch transcript: ${errorMessage}`);
    });

    it('should return a generic error message for non-Error rejections', async () => {
        const rejectionData = { someData: 'data' };
        (YoutubeTranscript.fetchTranscript as jest.Mock).mockRejectedValue(rejectionData);

        await expect(youtubeVideoScraper(HTTPS_URL))
            .rejects
            .toThrow('Failed to fetch transcript.');
    });


});

