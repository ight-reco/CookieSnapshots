jQuery(document).ready(function(){
    sendAction('get', null, snapshots => {
        snapshots.sort((a, b) => { return a.id > b.id }).map(snapshot => {
            var div = $('#snapshots');
            div.append(snapshot.name + ': ');
            div.append(`<a id="${snapshot.id}-restore" href="#">Restore</a>`);
            if (snapshot.id != 1) {
                div.append(`, <a id=" ${snapshot.id}-delete" href="#">Delete</a>`);
            }
            div.append('<br>');
        
            $(`#${snapshot.id}-restore`).on('click', () => {
                sendAction('restore', snapshot.id, url => {
                    console.log(url);
                    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
                        chrome.tabs.update(tabs[0].id, { url: url });
                    });
                });
            });
			$(`#${snapshot.id}-delete`).on('click', () => {
                sendAction('delete', snapshot.id, reloadTab);
            });
        });
    });

    $('#new-form').on('submit', () => {
        var name = $('#new-name').val();
        sendAction('save', name, reloadTab);
        return false;
    });

    $('#reset').on('click', () => {
        sendAction('reset', null, reloadTab);
    });

});

function sendAction(action, value, callback) {
    chrome.runtime.sendMessage({ action: action, value: value }, callback);
}

function reloadTab() {
    document.location.reload();
}

