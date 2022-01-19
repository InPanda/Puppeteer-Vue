class browserHeaderHandler {
    constructor(page) {
        this.page = page;
    }

    /**
     * 获取dom字符串
     * @returns {String} 获取dom字符串
     */
    async _getdom() {
        const fullUrl = await this.page.url();
        let showUrl = fullUrl.replace(/^https?:\/\/(www\.)?/i, '');
        const domStr = `
        <div class="wusu__left__icons">
                <svg t="1625133230776" class="wusu__arrow wusu__arrow__left" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="8518" width="20" height="20">
                    <path
                        d="M439.253333 841.216a42.666667 42.666667 0 0 0 59.904-60.8L270.08 554.666667h583.253333a42.666667 42.666667 0 1 0 0-85.333334H270.336L499.2 243.84a42.666667 42.666667 0 0 0-59.904-60.8l-295.424 291.114667a53.333333 53.333333 0 0 0 0 75.946666l295.424 291.114667z"
                        p-id="8519"></path>
                </svg>
    
                <svg t="1625133230776" class="wusu__arrow wusu__arrow__right" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="8518" width="20" height="20">
                    <path
                        d="M439.253333 841.216a42.666667 42.666667 0 0 0 59.904-60.8L270.08 554.666667h583.253333a42.666667 42.666667 0 1 0 0-85.333334H270.336L499.2 243.84a42.666667 42.666667 0 0 0-59.904-60.8l-295.424 291.114667a53.333333 53.333333 0 0 0 0 75.946666l295.424 291.114667z"
                        p-id="8519"></path>
                </svg>
    
                <svg t="1625133882193" class="wusu__refresh" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="9308" width="18" height="18">
                    <path
                        d="M866.133333 573.013333a42.666667 42.666667 0 0 0-53.333333 27.733334A304.64 304.64 0 0 1 519.68 810.666667 302.933333 302.933333 0 0 1 213.333333 512a302.933333 302.933333 0 0 1 306.346667-298.666667 309.76 309.76 0 0 1 198.4 71.253334l-92.586667-15.36a42.666667 42.666667 0 0 0-49.066666 35.413333 42.666667 42.666667 0 0 0 35.413333 49.066667l180.906667 29.866666h7.253333a42.666667 42.666667 0 0 0 14.506667-2.56 14.08 14.08 0 0 0 4.266666-2.56 33.28 33.28 0 0 0 8.533334-4.693333l3.84-4.693333c0-2.133333 3.84-3.84 5.546666-6.4s0-4.266667 2.133334-5.973334a57.173333 57.173333 0 0 0 2.986666-7.68l32-170.666666a42.666667 42.666667 0 0 0-85.333333-16.213334l-11.52 61.866667A392.96 392.96 0 0 0 519.68 128 388.266667 388.266667 0 0 0 128 512a388.266667 388.266667 0 0 0 391.68 384A389.12 389.12 0 0 0 896 626.346667a42.666667 42.666667 0 0 0-29.866667-53.333334z"
                        p-id="9309"></path>
                </svg>
    
                <svg t="1625188608986" class="wusu__home" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="1876" width="18" height="18">
                    <path
                        d="M762.3 565.3c0-19 15.7-34.1 34.7-34.1 19 0 34.2 15.1 34.2 34.1v336.3c0 19-15.2 34.4-34.2 34.4H229.6c-19.1 0-34.7-15.4-34.7-34.4V565.3c0-19 15.7-34.1 34.7-34.1 18.6 0 34.2 15.1 34.2 34.1v301.9h498.5V565.3z m-638.2 9.3l388.8-387.8 389.3 387.8c13.2 13.2 35.2 13.2 48.4 0 13.4-13.2 13.4-35.1 0-48.3L538 114.1l-0.7-0.5c-13.4-13.2-35.2-13.2-48.6 0l-413 412.6c-13.6 13.2-13.6 35.1 0 48.3 13.2 13.2 35.2 13.2 48.4 0.1z"
                        p-id="1877"></path>
                </svg>
            </div>
    
            <div class="wusu__center__link">
                <div class="wusu__left">
                    <svg t="1625189216066" class="wusu__lock" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="3356" width="12" height="12">
                        <path
                            d="M818.247 412.327h-45.989v-70.992c0-152.308-123.463-275.779-275.778-275.779S220.698 189.027 220.698 341.335v70.992h-45.987c-25.379 0-45.988 20.566-45.988 45.987v455.407c0 25.428 20.56 45.989 45.988 45.989h643.536c25.377 0 45.988-20.56 45.988-45.989V458.314c-0.045-25.42-20.611-45.987-45.988-45.987z m-137.915 0H312.625v-70.992c0-101.554 82.345-183.853 183.855-183.853 101.51 0 183.853 82.343 183.853 183.853v70.992h-0.001z m0 0"
                            p-id="3357"></path>
                    </svg>
                    <span class="wusu__link">${showUrl}</span>
                </div>
                <div class="wusu__right">
                    <svg t="1625191226947" class="wusu__star" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2257" width="16" height="16">
                        <path
                            d="M520.234667 66.048a17.493333 17.493333 0 0 1 7.210666 7.253333l135.168 254.165334 282.965334 50.346666a17.536 17.536 0 0 1 9.514666 29.44l-199.381333 207.488 39.68 285.312a17.493333 17.493333 0 0 1-24.96 18.176L512 792.234667l-258.432 125.994666a17.493333 17.493333 0 0 1-24.96-18.176l39.68-285.312-199.381333-207.488a17.578667 17.578667 0 0 1 9.514666-29.44l282.922667-50.346666 135.253333-254.165334a17.493333 17.493333 0 0 1 23.637334-7.253333z m100.522666 318.976L512 180.522667 403.242667 385.024l-227.968 40.576 160.64 167.168-31.914667 229.674667L512 721.066667l207.957333 101.376-31.872-229.674667 160.597334-167.168-227.925334-40.533333z"
                            p-id="2258"></path>
                    </svg>
                </div>
            </div>
    
            <div class="wusu__right__icons">
                <div class="wusu__user">
                    <svg t="1625191809187" class="wusu__user__icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="6424" width="16" height="16">
                        <path
                            d="M512 490.666667A181.333333 181.333333 0 1 1 512 128a181.333333 181.333333 0 0 1 0 362.666667zM128 853.333333v-21.333333a298.666667 298.666667 0 0 1 298.666667-298.666667h170.666666a298.666667 298.666667 0 0 1 298.666667 298.666667v21.333333a42.666667 42.666667 0 0 1-42.666667 42.666667H170.666667a42.666667 42.666667 0 0 1-42.666667-42.666667z"
                            p-id="6425"></path>
                    </svg>
                </div>
                <svg t="1625191989245" class="wusu__more" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="7307" width="18" height="18">
                    <path
                        d="M511.910972 276.347866c43.753024 0 79.233262-35.478281 79.233261-79.237175 0-43.760851-35.480237-79.241088-79.233261-79.241088-43.760851 0-79.239132 35.480237-79.239132 79.241088 0 43.758894 35.478281 79.237175 79.239132 79.237175z m0 158.476307c-43.760851 0-79.239132 35.482194-79.239132 79.239132 0 43.762808 35.478281 79.237175 79.239132 79.237175 43.753024 0 79.233262-35.474367 79.233261-79.237175 0-43.756938-35.480237-79.239132-79.233261-79.239132z m0 316.956527c-43.760851 0-79.239132 35.437191-79.239132 79.237176 0 43.756938 35.478281 79.237175 79.239132 79.237175 43.753024 0 79.233262-35.480237 79.233261-79.237175 0-43.799984-35.480237-79.237175-79.233261-79.237176z"
                        fill="#525252" p-id="7308"></path>
                </svg>
            </div>`;
        return domStr;
    }

    /**
     * 获取style字符串
     * @returns {String} styleStr style字符串
     */
    _getStyle() {
        const styleStr = `body {
            -ms-overflow-style: none;
            overflow: -moz-scrollbars-none;
        }

        body::-webkit-scrollbar {
            width: 0 !important;
        }
    
        .wusu__browser__header {
            position:absolute;
            z-index:${Number.MAX_SAFE_INTEGER};
            left:0;
            top:0;
            background-color: #fff;
            width: 100vw;
            overflow: hidden;
            height: 35px;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            padding: 0 12px;
            box-sizing: border-box;
            border-bottom: 1px solid #DADCE0;
        }
    
        .wusu__browser__header>.wusu__center__link {
            flex: 1 0 auto;
            background-color: #F1F3F4;
            height: 28px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    
        .wusu__browser__header>.wusu__right__icons {
            margin-left: 12px;
            display: flex;
            align-items: center;
        }
    
        .wusu__left__icons>.wusu__arrow {
            fill: #BABCBE;
        }
    
        .wusu__left__icons>.wusu__arrow.wusu__arrow.wusu__arrow__left {
            margin-right: 6px;
        }
    
        .wusu__left__icons>.wusu__arrow.wusu__arrow__right {
            transform: rotate(180deg);
        }
    
        .wusu__left__icons>.wusu__refresh {
            fill: #5F6368;
            margin-left: 8px;
        }
    
        .wusu__left__icons>.wusu__home {
            margin-left: 10px;
            margin-right: 12px;
        }
    
        .wusu__center__link>.wusu__left>.wusu__lock {
            fill: #626365;
            margin-left: 12px;
            margin-right: 8px;
        }
    
        .wusu__center__link>.wusu__left>.wusu__link {
            font-size: 14px;
            color: #202124;
        }
    
        .wusu__center__link>.wusu__right {
            display: flex;
            align-items: center;
        }
    
        .wusu__center__link>.wusu__right>.wusu__star {
            fill: #444444;
            margin-right: 10px;
        }
    
        .wusu__right__icons>.wusu__user {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background-color: #DEE1E6;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 12px;
        }
    
        .wusu__right__icons>.wusu__user>.wusu__user__icon {
            fill: #555F70;
        }`
        return styleStr;
    }

    async addHeader() {
        const header = await this.page.$('.wusu__browser__header');
        if (!!header) {
            await this.removeHeader();
        }
        const _dom = await this._getdom();
        const template = {
            dom: _dom,
            style: this._getStyle(),
        };
        await this.page.evaluate((template) => {
            let stylee = document.createElement('style');
            stylee.type = 'text/css';
            stylee.classList.add('wusu__browser__header__style');
            stylee.innerHTML = template.style;
            document.body.insertBefore(stylee, document.body.firstChild);

            let div = document.createElement('div');
            div.classList.add('wusu__browser__header');
            div.innerHTML = template.dom;
            document.body.insertBefore(div, document.body.firstChild);
        }, template);
        try {
            await this.page.waitForSelector('.wusu__browser__header', {
                timeout: 30000,
                visible: true,
            });
        } catch (error) {
            return;
        }
    }

    async removeHeader() {
        const header = await this.page.$('.wusu__browser__header');
        if (!!header) {
            await this.page.evaluate(() => {
                const header = document.querySelector('.wusu__browser__header');
                header.remove();
                const stylee = document.querySelector('.wusu__browser__header__style');
                stylee.remove();
            });
            try {
                await this.page.waitForSelector('.waitForSelector', {
                    hidden: true,
                    timeout: 30000,
                });
            } catch (error) {
                return;
            }
        }
    }
}

module.exports = browserHeaderHandler;
