"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var selenium_webdriver_1 = require("selenium-webdriver");
var chrome = require("selenium-webdriver/chrome");
var fs = require("fs/promises");
(function scrapeYoutubeChannel() {
    return __awaiter(this, void 0, void 0, function () {
        var args, url, channelId, chromeOptions, driver, consentButtonXpath, consentButton, error_1, lastHeight, height, videoElements, _i, videoElements_1, videoElement, link, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = process.argv.slice(2);
                    if (args.length === 0) {
                        console.error('Please provide a URL as an argument.');
                        return [2 /*return*/];
                    }
                    url = args[0];
                    channelId = url.split('/')[4];
                    chromeOptions = new chrome.Options();
                    chromeOptions.addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage');
                    return [4 /*yield*/, new selenium_webdriver_1.Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build()];
                case 1:
                    driver = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 23, 24, 26]);
                    console.log('Navigating to the provided URL...');
                    return [4 /*yield*/, driver.get(url)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, driver.sleep(5000)];
                case 4:
                    _a.sent(); // wait for 5 seconds
                    console.log('Clicking on the consent button if present...');
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 8, , 9]);
                    consentButtonXpath = "//button[@aria-label='Reject all']";
                    return [4 /*yield*/, driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath(consentButtonXpath)), 30000)];
                case 6:
                    consentButton = _a.sent();
                    return [4 /*yield*/, consentButton.click()];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.log('Consent button not found or clicked. Moving on...');
                    return [3 /*break*/, 9];
                case 9:
                    lastHeight = -1;
                    return [4 /*yield*/, driver.executeScript("return document.documentElement.scrollHeight")];
                case 10:
                    height = _a.sent();
                    _a.label = 11;
                case 11:
                    if (!(lastHeight !== height)) return [3 /*break*/, 15];
                    console.log("Scrolling to height: ".concat(height, "..."));
                    return [4 /*yield*/, driver.executeScript("window.scrollTo(0, ".concat(height, ");"))];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, driver.sleep(2000)];
                case 13:
                    _a.sent();
                    lastHeight = height;
                    return [4 /*yield*/, driver.executeScript("return document.documentElement.scrollHeight")];
                case 14:
                    height = _a.sent();
                    return [3 /*break*/, 11];
                case 15:
                    console.log('Collecting video links...');
                    return [4 /*yield*/, driver.findElements(selenium_webdriver_1.By.xpath('//*[@id="video-title"]'))];
                case 16:
                    videoElements = _a.sent();
                    _i = 0, videoElements_1 = videoElements;
                    _a.label = 17;
                case 17:
                    if (!(_i < videoElements_1.length)) return [3 /*break*/, 22];
                    videoElement = videoElements_1[_i];
                    return [4 /*yield*/, videoElement.getAttribute('href')];
                case 18:
                    link = _a.sent();
                    if (!link) return [3 /*break*/, 20];
                    console.log("Found video link: ".concat(link));
                    return [4 /*yield*/, fs.appendFile("".concat(channelId, ".list"), "".concat(link, "\n"))];
                case 19:
                    _a.sent();
                    return [3 /*break*/, 21];
                case 20:
                    console.log('Encountered a null video link.');
                    _a.label = 21;
                case 21:
                    _i++;
                    return [3 /*break*/, 17];
                case 22: return [3 /*break*/, 26];
                case 23:
                    error_2 = _a.sent();
                    console.error('An error occurred:', error_2);
                    return [3 /*break*/, 26];
                case 24:
                    console.log('Quitting driver...');
                    return [4 /*yield*/, driver.quit()];
                case 25:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 26: return [2 /*return*/];
            }
        });
    });
})();
