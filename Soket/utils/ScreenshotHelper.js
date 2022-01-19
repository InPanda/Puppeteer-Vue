const loghelper = require('./loghelper');
const { joinImages } = require('join-images');
const browserHeaderHandler = require('./browserHeaderHandler');
const { sleep } = require('./utilityFuncs');

class ScreenshotHelper {
    constructor(page) {
        this.page = page;
        this.bhHelper = new browserHeaderHandler(page);
    }

    /**
     * 全屏截图
     * @param {String} path 图片存储路径
     * @param {String} type 图片类型,jpeg\png\webp
     */
    async fullPage(path, type) {
        const client = await this.page.target().createCDPSession();
        await client.send('Page.enable');
        // 添加伪浏览器地址栏,并对其进行截图
        await this.bhHelper.addHeader();
        // const bh = await this.page.$('.wusu__browser__header');
        // if (!bh) {
        //     return false;
        // }
        let loadHeaderTimer = null;
        let loadHeaderTimeout = null;
        await client.send('DOM.enable');
        let isHeaderPainted = new Promise((resolve) => {
            loadHeaderTimer = setInterval(async () => {
                // const dom = await this.page.evaluate(() => {
                //     const dom = document.querySelector('.wusu__browser__header');
                //     return !!dom;
                // })
                // if (dom) {
                //     clearInterval(loadHeaderTimer);
                //     clearTimeout(loadHeaderTimeout);
                //     resolve(true);
                // }
                await this.scrollToTop();
                try {
                    const nodeOfLocation = await client.send('DOM.getNodeForLocation', {
                        x: 0,
                        y: 34,
                    });
                    if (nodeOfLocation && nodeOfLocation.backendNodeId) {
                        const outerHtml = await client.send('DOM.getOuterHTML', {
                            backendNodeId: nodeOfLocation.backendNodeId,
                        });
                        const isRightPositin = outerHtml.outerHTML.indexOf('<div class="wusu__browser__header">') !== -1;
                        if (isRightPositin) {
                            clearInterval(loadHeaderTimer);
                            clearTimeout(loadHeaderTimeout);
                            resolve(true);
                        }
                    }
                } catch (error) {
                    // loghelper.error(`截图时添加伪浏览器后调用DOM.getNodeForLocation失败,${error}`);
                    await this.scrollToTop();
                }
            }, 200);
        });
        let isLoadHeaderTimeout = new Promise((resolve) => {
            loadHeaderTimeout = setTimeout(() => {
                clearInterval(loadHeaderTimer);
                resolve(false);
            }, 60000);
        });
        const isHeaderLoaded = await Promise.race([isHeaderPainted, isLoadHeaderTimeout]);
        let pics = [];
        let bw = 0;

        if (!isHeaderLoaded) {
            // 等待伪浏览器地址栏超时,清除该元素,后续不再将其拼接到截图中
            loghelper.error(`添加伪浏览器地址栏失败,等待超时`);
            await this.bhHelper.removeHeader();
        } else {
            const bh = await this.page.$('.wusu__browser__header');
            let bhBoundingBox = await bh.boundingBox();
            bw = bhBoundingBox.width;
            bhBoundingBox.y = 0;
            bhBoundingBox.x = 0;
            let bhImg = null;
            try {
                let options = {
                    format: type,
                    clip: {
                        ...bhBoundingBox,
                        scale: 1,
                    },
                    captureBeyondViewport: true,
                    fromSurface: true,
                };
                if (type === 'jpeg') {
                    options['quality'] = 100;
                }
                const base64Img = await client.send('Page.captureScreenshot', options);
                bhImg = Buffer.from(base64Img.data, 'base64');
                pics.push(bhImg);
            } catch (error) {
                loghelper.error(`截取伪浏览器地址栏失败,${error}`);
                return false;
            }
            await this.bhHelper.removeHeader();
        }
        const layoutMetrics = await client.send('Page.getLayoutMetrics');
        const totalHeight = layoutMetrics.contentSize.height;
        // const clientWidth = Math.abs(layoutMetrics.cssLayoutViewport.pageX);
        const areaCount = Math.ceil(totalHeight / 10000);
        if (areaCount < 1) {
            return false;
        } else if (areaCount === 1) {
            // 图片总高度小于等于10000px
            let mainImg = null;
            try {
                let options = {
                    format: type,
                    clip: {
                        x: 0,
                        y: 0,
                        width: bw,
                        height: totalHeight,
                        scale: 1,
                    },
                    captureBeyondViewport: true,
                    fromSurface: true,
                    quality: 100,
                };
                // if (type === 'jpeg') {
                //     options['quality'] = 100;
                // }
                let base64Img = null;
                try {
                    base64Img = await client.send('Page.captureScreenshot', options);
                } catch (error) {
                    loghelper.error(`截图失败,${error}`);
                    return false;
                }
                mainImg = Buffer.from(base64Img.data, 'base64');
                pics.push(mainImg);
            } catch (error) {
                loghelper.error(`全屏截图(非拼接)失败,${error}`);
                return false;
            }
            return await joinImages(pics, {
                direction: 'vertical',
            }).then((img) => {
                return img.toFile(path).then((data) => {
                    return true;
                });
            });
        } else {
            // 图片总高度大于10000px,采用图片拼接的方式
            for (let i = 0; i < areaCount; i++) {
                let tempImg = null;
                try {
                    let options = {
                        format: type,
                        clip: {
                            x: 0,
                            y: i * 10000,
                            width: bw,
                            height: i === areaCount - 1 ? totalHeight % 10000 : 10000,
                            scale: 1,
                        },
                        captureBeyondViewport: true,
                        fromSurface: true,
                    };
                    if (type === 'jpeg') {
                        options['quality'] = 100;
                    }
                    const base64Img = await client.send('Page.captureScreenshot', options);
                    tempImg = Buffer.from(base64Img.data, 'base64');
                } catch (error) {
                    loghelper.error(`全屏截图(拼接)失败,${error}`);
                    return false;
                }
                pics.push(tempImg);
            }
            return await joinImages(pics, {
                direction: 'vertical',
            }).then((img) => {
                return img.toFile(path).then((data) => {
                    return true;
                });
            });
        }
    }

    async scrollToTop() {
        await this.page.evaluate(() => {
            window.scrollTo(0, 0);
        });
    }
}

module.exports = ScreenshotHelper;