(function () {
    'use strict';

    function appendMessage(msg) {
        var elem = document.getElementById('msg');
        if (!elem) {
            elem = document.createElement('div');
            elem.id = 'msg';
            document.body.appendChild(elem);
        }

        elem.innerHTML = 'From JavaScript: ' + msg;
    }

    var getJSON = function (url, successHandler, errorHandler) {
        if (!url) { throw new Error('No URL provided.'); }
        successHandler = successHandler || function() {};
        errorHandler = errorHandler || function() {};

        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            if (xhr.status === 200) {
                successHandler(xhr.response);
            } else {
                errorHandler(xhr.status);
            }
        };

        xhr.send();
    };

    getJSON('api/values', function (data) {
        appendMessage(JSON.stringify(data));
    }, function (status) {
        appendMessage('Failed to load data.');
    });
} ());
