ezModel.message = "This is a message using EZ-Binding from the script ... :)";
ezModel.time = (new Date()).toString();

setInterval(function () {
    ezModel.time = (new Date()).toString();
}, 1000);