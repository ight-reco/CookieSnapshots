
chrome.tabs.onUpdated.addListener(tabId => {
    chrome.pageAction.show(tabId);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("received " + request.action);

    // Dispatch
    getActiveTabWithOrigin().then(info => {
        var origin = info.origin;
        var url    = info.tab.url;

        switch (request.action) {
            case 'get':
                getSnapshots(origin)
                    .then(snapshots => { sendResponse(snapshots) });
                break;
            case 'save':
                saveSnapshot(origin, request.value, url)
                    .then(() => { sendResponse({}) });
                break;
            case 'restore':
                restoreSnapshot(origin, request.value)
                    .then(url => { sendResponse(url) });
                break;
            case 'delete':
                deleteSnapshot(origin, request.value)
                    .then(() => { sendResponse({}) });
                break;
            case 'reset':
                resetAll()
                    .then(() => { sendResponse({}) });
                break;

            default:
                console.log('unknown action: ' + action.name);
        }
    }).catch();

    return true;
});

var all = loadSnapshots();

function loadSnapshots() {
    if (!localStorage.all) {
        localStorage.all = JSON.stringify({});
    }

    return JSON.parse(localStorage.all);
}

function getSnapshots(origin) {
    if (! all[origin]) {
        all[origin] = [
            {
                id: 1,
                name: 'NoCookie',
                cookies: [],
                url: origin,
            },
        ];
    }
    return Promise.resolve(all[origin]);
}

function saveSnapshot(origin, name, url) {
    return new Promise((resolve, reject) => {
        chrome.cookies.getAll({ url: origin }, cookies => {
            var ids = all[origin].map(snapshot => snapshot.id);
            var clonedCookies = cookies ? cookies.map(c => cloneCookie(c)) : [];
            var snapshot = {
                id: Math.max.apply(null, ids) + 1,
                name: name,
                cookies: clonedCookies,
                url: url,
            };

            all[origin].push(snapshot);
            localStorage.all = JSON.stringify(all);
            resolve();
        });
    });
};

function restoreSnapshot(origin, id) {
    var fetchCookieNamesTask = () => {
        return new Promise((resolve, reject) => {
            chrome.cookies.getAll({ url: origin }, cookies => {
                resolve(cookies.map(cookie => cookie.name));
            });
        });
    };

    var clearCookiesTask = names => {
        return Promise.all([
            names.map(name => {
                new Promise((resolve, reject) => {
                    chrome.cookies.remove({ url: origin, name: name });
                });
            })
        ]);
    };

    var snapshot = all[origin].filter(s => { return s.id == id })[0];
    var restoreCookiesTask = () => {
        return Promise.all([
            snapshot.cookies.map(cookie => {
                new Promise((resolve, reject) => {
                    chrome.cookies.set(cookie, () => { resolve() });
                });
            })
        ]);
    };

    return Promise.resolve()
        .then(fetchCookieNamesTask)
        .then(clearCookiesTask)
        .then(restoreCookiesTask)
        .then(() => snapshot.url);
}

function deleteSnapshot(origin, id) {
    all[origin] = all[origin].filter(s => { return s.id != id });
    localStorage.all = JSON.stringify(all);
    return Promise.resolve();
}

function resetAll() {
    delete localStorage.all;
    all = loadSnapshots();
    return Promise.resolve();
}


