const puppeteer = require('puppeteer');
const _os = require('os');

module.exports = class BrowserHelper {
    constructor() {
        this.browser = null;
        this.pages = [];
        this.maxPageSize = this._isHighPerformanceCpu() ? 8 : 4; // 最大页面并发提取数。
    }

    /**
     * 初始化浏览器及页面
     */
    async init() {
        this.pages = [];
        this.browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
        });
        for (let index = 0; index < this.maxPageSize; index++) {
            this.pages.push({
                pageObj: await this.browser.newPage(),
                isUsing: false,
            });
        }
    }

    _isHighPerformanceCpu() {
        let cpus = _os.cpus();
        return !(cpus.length < 4 || (cpus.length === 4 && cpus[0].speed < 3000));
    }
    /**
     * 销毁page和browser
     */
    async destroyBrowser() {
        await this.browser.close();
        this.pages = [];
        this.browser = null;
    }

    /**
     * 获取可用页面
     */
    getFreePages() {
        let freePage = [];
        for (let index = 0, temp = null, ct = this.pages.length; index < ct; index++) {
            temp = this.pages[index];
            if (temp !== null && temp.pageObj !== null && !temp.isUsing) {
                freePage.push(temp);
            }
        }

        return freePage;
    }

    /**
     * 获取CPU使用率，1秒内的使用率
     */
    getCPUUsage() {
        return new Promise((resolve, reject) => {
            try {
                let stats1 = this.getCPUInfo();
                let startIdle = stats1.idle;
                let startTotal = stats1.total;

                setTimeout(() => {
                    let stats2 = this.getCPUInfo();
                    let endIdle = stats2.idle;
                    let endTotal = stats2.total;

                    let idle = endIdle - startIdle;
                    let total = endTotal - startTotal;
                    let perc = idle / total;

                    resolve(1 - perc);
                }, 1000);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 获取CPU信息。
     * @param {any} callback 回调函数。
     * @returns {JSON} json对象，CPU空闲和总使用量。
     */
    getCPUInfo() {
        let cpus = _os.cpus();

        let user = 0,
            nice = 0,
            sys = 0,
            idle = 0,
            irq = 0,
            total = 0;

        for (let cpu in cpus) {
            user += cpus[cpu].times.user;
            nice += cpus[cpu].times.nice;
            sys += cpus[cpu].times.sys;
            irq += cpus[cpu].times.irq;
            idle += cpus[cpu].times.idle;
        }

        total = user + nice + sys + idle + irq;

        return {
            'idle': idle,
            'total': total,
        };
    }
};
