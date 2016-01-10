function getJson(url) {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send();
        var data = xhr.responseText;

        return (data == null || data == '') ? {Company: '', Last: 0} : JSON.parse(xhr.responseText);
    } catch (e) {
        return ''; // turn all errors into empty results
    }
}