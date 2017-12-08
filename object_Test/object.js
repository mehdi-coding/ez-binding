ez.time = (new Date()).toString();
setInterval(function () {
    ez.time = (new Date()).toString();
}, 1000);

window.onload = () => {
    ez.addGS({
        variableName: "user.age",
        set: (obj, prop, newValue) => {
            if(newValue < 50) ez.message = "You too Youg";
            else if (newValue > 100) ez.message = "You are too Old"
            else ez.message = "You are welcome to register"
        }
    })
}

