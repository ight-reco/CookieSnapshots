function getActiveTabWithOrigin() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
            if (tabs[0].url) {
                resolve({
                    origin: (new URL(tabs[0].url)).origin,
                    tab: tabs[0],
                });
            }
            else {
                reject('could not get origin');
            }
        });
    });
}

function getTabOrigin(tabId) {
    return new Promise((resolve, reject) => {
        chrome.tabs.get(tabId, tab => {
            if (tab.url) {
                resolve((new URL(tab.url)).origin);
            }
            else {
                reject('could not get origin');
            }
        });
    });
}

function cloneCookie(cookie) {
    // https://developer.chrome.com/extensions/cookies
    var scheme = "http" + (cookie.secure ? "s" : "");
	var newCookie = {
        url: scheme + '://' + cookie.domain + cookie.path,
        name: cookie.name,
        value: cookie.value,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        storeId: cookie.storeId,
    };

    if(!cookie.hostOnly) {
        newCookie.domain = cookie.domain;
    }
    if(!cookie.session) {
        newCookie.expirationDate = cookie.expirationDate;
    }
    return newCookie;
}



