var x;

(function () {
    x = document.querySelectorAll('input');
    x[0].addEventListener('input', function (evt) {
        x[0].value = x[0].value.toUpperCase();
    });
})();

let customer = {
    first: "Ez",
    last: "Model"
}

ezModel = customer