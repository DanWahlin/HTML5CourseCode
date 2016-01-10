var pixSocket = function() {
    var settings,

    connect = function(_settings) {
        settings = _settings;
        var connection = new WebSocket(settings.host);

        connection.onopen = function () {};

        connection.onmessage = function (message) {
            var pix = JSON.parse(message.data);
            showPicture(pix.media.m, pix.title);
        };
    },

    showPicture = function(src, title) {
        var picContainer = $('#' + settings.pictureContainerID);
        picContainer.fadeOut(500, function() {
            $('#' + settings.pictureID).attr('src', src);
            $('#' + settings.titleID).html(title);
            picContainer.fadeIn(500);
        });
    };

    return {
        connect: connect
    };
}();