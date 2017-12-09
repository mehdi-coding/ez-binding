ez.time = (new Date()).toString();
setInterval(function () {
    ez.time = (new Date()).toString();
}, 1000);

ez.subscribers = []

ez.message = "Please Specify tour age ..."
ez.addGS({
    variableName: "user.age",
    set: (obj, prop, newValue) => {
        let btn = document.getElementById("addBtn")
        let msg = document.createElement('p');

        if (newValue < 50) {
            msg.innerText = "You are too Young"
            msg.classList.add("error");
            btn.disabled = true;
        }
        else if (newValue > 100) {
            msg.innerText = "You are too Old"
            msg.classList.add("error");
            btn.disabled = true;
        }
        else {
            msg.innerText = "You are welcome to register"
            msg.classList.add("good");
            btn.disabled = false;
        }

        ez.message = msg.outerHTML

        return newValue
    }
})

function add() {
    let user= {
        name: ez.user.name,
        email: ez.user.email,
        age: ez.user.age
    }
    ez.subscribers.push(user)
}


