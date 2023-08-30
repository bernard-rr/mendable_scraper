# Mendable Scraper Suite

This repository contains utilities to fetch metadata from YouTube channels, fetch video transcripts, fetch transcripts from entire channel, and scrape data from YAML files (like OpenAPI specs).

Below you'll find a description of each utility and how to use them.

## Table of Contents
- [Utilities](#utilities)
    - [fetchChannelMetadata.ts](#fetchchannelmetadatats)
    - [fetchVideoTranscript.ts](#fetchvideotranscriptts)
    - [fetchChannelTranscripts.ts](#fetchchanneltranscriptsts)
    - [fetchYamlData.ts](#fetchyamldatats)
- [Tests](#tests)

## Utilities

### fetchChannelMetadata.ts
This utility is used to fetch video links from a given YouTube channel URL.

#### Usage:
```typescript
import { fetchVideosFromChannel } from './fetchChannelMetadata';

fetchVideosFromChannel('https://www.youtube.com/@engineerprompt/videos');
```

### fetchVideoTranscript.ts
This utility fetches the transcript of a given YouTube video link.

#### Usage:
```typescript
import { youtubeVideoScraper } from './fetchVideoTranscript';

const videoURL = 'youtube.com/watch?v=wHEIT32ZEVs';
youtubeVideoScraper(videoURL).then(console.log).catch(console.error);
```

### fetchChannelTranscripts.ts
This utility fetches transcripts from an entire YouTube channel, given its URL.

#### Usage:
```typescript
import { fetchTranscriptsFromChannel } from './fetchChannelTranscripts';

fetchTranscriptsFromChannel('https://www.youtube.com/@Finaius').then(results => {
    // Handle results here.
}).catch(error => {
    console.error(`Failed to fetch transcripts: ${error}`);
});
```

### fetchYamlData.ts
This utility fetches and parses YAML content, converting it into sections for further processing. It can be useful for working with OpenAPI specifications.

#### Usage:
```typescript
import { scrapeOpenApiYaml } from './fetchYamlData';

scrapeOpenApiYaml('https://petstore.swagger.io/v2/swagger.yaml').then(sections => {
    console.log(JSON.stringify(sections, null, 2));
});
```

## Tests

Testing is a crucial aspect of our development process. It ensures code reliability and robustness. Here's a guide on our testing procedures:

### **Prerequisites**

Ensure you have `jest` installed globally or locally within the project:

```bash
npm install jest --save-dev
```

### **Running the Tests**

#### Running All Tests:

```bash
npm test
```

#### Running Individual Tests:

For `fetchVideoTranscript.test.ts`:

```bash
npx jest fetchVideoTranscript.test.ts
```

For `fetchYamlData.test.ts`:

```bash
npx jest fetchYamlData.test.ts
```

### **Test Suites**

1. **fetchVideoTranscript.test.ts**
    - **YouTube URL Validity**: Checks if different URL formats (http, https, regular, short) are recognized as valid YouTube URLs.
    - **Transcript Fetching**: Verifies that valid YouTube URLs return a proper formatted response when fetching transcripts.
    - **Error Handling**: Ensures that errors during transcript fetching, whether from the YouTube Transcript service or elsewhere, are correctly handled and appropriate error messages are relayed.

2. **fetchYamlData.test.ts**
    - **Fetching with Retry**: Validates data fetching retries on failures and can either succeed or fail after a set number of retries.
    - **YAML Parsing**: Ensures valid YAML data is correctly parsed into sections and errors like a 404 response result in appropriate outcomes.
