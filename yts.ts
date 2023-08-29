import puppeteer from 'puppeteer';
import * as fs from 'fs';

const wait = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export const fetchVideosFromChannel = async (channelURL: string) => {
    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();

        if (!channelURL.endsWith('/videos')) {
            channelURL += '/videos';
        }

        await page.goto(channelURL, { waitUntil: 'networkidle2' });

        await wait(5000);

        const consentButtonSelector = 'button[aria-label="Reject all"]';
        if (await page.$(consentButtonSelector) !== null) {
            await page.click(consentButtonSelector);
        }

        await wait(10000);

        let height = await page.evaluate(() => document.documentElement.scrollHeight);
        let lastHeight = 0;

        while (lastHeight !== height) {
            lastHeight = height;
            await page.evaluate(height => {
                window.scrollTo(0, height);
            }, height);
            await wait(2000);
            height = await page.evaluate(() => document.documentElement.scrollHeight);
        }

        const videos = await page.$$eval('a[id="video-title-link"]', (elements, channelURL) => elements.map(e => ({
            title: e.getAttribute("aria-label")?.split(" by ")[0]?.trim() || "",
            link: "https://www.youtube.com" + e.getAttribute("href"),
            channel: channelURL.split('/').slice(-2, -1)[0]
        })), channelURL);

        const currentDate = new Date().toISOString().split('T')[0];
        const filename = `${videos[0].channel}_${currentDate}.json`;

        fs.writeFileSync(filename, JSON.stringify(videos, null, 2));

        await browser.close();

        return videos;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Failed to fetch videos due to error: ${error.message}`);
        } else {
            console.error('Failed to fetch videos due to an unknown error.');
        }
        await browser.close();
        return [];
    }
}

// Example usage:
fetchVideosFromChannel('https://www.youtube.com/@engineerprompt/videos');
