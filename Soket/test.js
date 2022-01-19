const puppeteer = require('puppeteer');
const { fixPages } = require('./server/page');
const BrowserHelper = require('./utils/browserHelper');

const log4js = require('log4js');
log4js.configure({
    appenders: {
        cheese: {
            type: 'file',
            filename: 'error.log',
            keepFileExt: true,
            maxLogSize: 1024 * 1024 * 4,
        },
    },
    categories: {
        default: {
            appenders: ['cheese'],
            level: 'error',
        },
    },
});

const logger = log4js.getLogger('capture');

(async () => {
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222',
        defaultViewport: {
            width: 1920,
            height: 1080,
        },
    });
    let bh = new BrowserHelper();

    /*  const page = await browser.newPage();
 
    await fixPages(
        null,
        page,
        {
            save_path: '',
            type: 0,
            id: 'test_00000',
            url: 'https://item.jd.com/100012117641.html?cu=true&utm_source=jd.idey.cn&utm_medium=tuiguang&utm_campaign=t_2011568665_&utm_term=c6711ceec04f4a589b00a8a90f96f30a',
        },
        logger
    ); */
    let pagesArr = new Array(10).fill({});
    for (let i = 0; i < pagesArr.length; i++) {
        pagesArr[i].page = await browser.newPage();
    }
    for (let index = 0; index < pagesArr.length; index++) {
        let CPUUsage = await bh.getCPUUsage();
        let isHighPerformaceCup = bh._isHighPerformanceCpu()
        console.log(CPUUsage);
        console.log(isHighPerformaceCup);
        await fixPages(
            null,
            pagesArr[index].page,
            {
                save_path: 'G://screenshot',
                type: 0,
                id: `test_0000${index}`,
                url: 'https://item.jd.com/100012117641.html?cu=true&utm_source=jd.idey.cn&utm_medium=tuiguang&utm_campaign=t_2011568665_&utm_term=c6711ceec04f4a589b00a8a90f96f30a',
            },
            logger
        );
    }
})();
