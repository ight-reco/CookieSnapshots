jQuery(document).ready(() => {

    // TODO: Send to background.js
    if (!localStorage.options) {
        // default values
        localStorage.options = {
            autoReload: true,
            autoSave: true,
        };
    }
    $('#auto-reload').prop('checked', localStorage.options.autoReload).change(() => {
        localStorage.options.autoReload = $('#auto-reload').prop('checked');
    });

    $('#auto-save').prop('checked', localStorage.options.autoSave).change(() => {
        localStorage.options.autoSave = $('#auto-save').prop('checked');
    });
});



