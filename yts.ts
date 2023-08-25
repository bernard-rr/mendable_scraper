import { Builder, By, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as fs from 'fs/promises';

(async function scrapeYoutubeChannel() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Please provide a URL as an argument.');
        return;
    }
    const url = args[0];
    const channelId = url.split('/')[4];

    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments(
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage'
    );

    const driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

    try {
        console.log('Navigating to the provided URL...');
        await driver.get(url);
        await driver.sleep(5000); // wait for 5 seconds

        console.log('Clicking on the consent button if present...');
        try {
            const consentButtonXpath = "//button[@aria-label='Reject all']";
            const consentButton = await driver.wait(until.elementLocated(By.xpath(consentButtonXpath)), 30000);
            await consentButton.click();
        } catch (error) {
            console.log('Consent button not found or clicked. Moving on...');
        }

        let lastHeight = -1;
        let height = await driver.executeScript("return document.documentElement.scrollHeight");

        while (lastHeight !== height) {
            console.log(`Scrolling to height: ${height}...`);
            await driver.executeScript(`window.scrollTo(0, ${height});`);
            await driver.sleep(2000);
            lastHeight = height;
            height = await driver.executeScript("return document.documentElement.scrollHeight");
        }

        console.log('Collecting video links...');
        const videoElements = await driver.findElements(By.xpath('//*[@id="video-title"]'));
        for (const videoElement of videoElements) {
            const link = await videoElement.getAttribute('href');
            if (link) {
                console.log(`Found video link: ${link}`);
                await fs.appendFile(`${channelId}.list`, `${link}\n`);
            } else {
                console.log('Encountered a null video link.');
            }
        }
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        console.log('Quitting driver...');
        await driver.quit();
    }
})();
