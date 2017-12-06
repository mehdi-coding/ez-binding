let forwarder = "Forwarder ..."
ezGS = {
    eztrue: {
        get: (value) => {
            // console.log('Getter eztrue ...', value);
            return value;
        },
        set: (value) => {
            // console.log('Setter eztrue ...', value);
            return true;
        }
    },
    ezfalse: {
        get: (value) => {
            // console.log('Getter ezfalse ...', value);
            return value;
        },
        set: (value) => {
            // console.log('Setter ezfalse ...', value);
            return false;
        }
    },
    ezundefine: {
        get: (value) => {
            // console.log('Getter ezundefine ...', value);
            return value;
        },
        set: (value) => {
            // console.log('Setter ezundefine ...', value);
            return undefined;
        }
    },
    ezvalue: {
        get: (value) => {
            // console.log('Getter ezvalue ...', value);
            return value;
        },
        set: (value) => {
            // console.log('Setter ezvalue ...', value);
            return "Value From Setter ...";
        }
    },
    eznull: {
        get: (value) => {
            // console.log('Getter eznull ...', value);
            return value;
        },
        set: (value) => {
            // console.log('Setter eznull ...', value);
            return null;
        }
    },
    ezchanged: {
        get: (value) => {
            return value;
        },
        set: (value, old) => {
            ez.message = "Here a Forced new value ..."
            return value;
        }
    },
    notfunction:{
        get: "Im getting...",
        set: "Im setting ..."
    },
    forwarder: {
        get: (value) => {
            return forwarder;
        },
        set: (value, old) => {
            forwarder = value;
            return value;
        }
    }
};
function testSet() {
    ez.message = "This is a message";
    ez.eztrue = "here we true";
    ez.ezfalse = "Here false";
    ez.ezundefine = "Here Undefined";
    ez.ezvalue = "Here a value";
    ez.eznull = "Here null";
    ez.ezchanged = "Test Forward";
    ez.notfunction= "test not a function ..."
    ez.forwarder= "Testing if fw "
}

function testGet(params) {
    console.log('message:', ez.message);
    console.log('eztrue:', ez.eztrue);
    console.log('ezfalse:', ez.ezfalse);
    console.log('ezundefine:', ez.ezundefine);
    console.log('ezvalue:', ez.ezvalue);
    console.log('eznull:', ez.eznull);
    console.log('ezchanged:', ez.ezchanged);
    console.log('notfunction:', ez.notfunction);
    console.log('notfunction:', ez.forwarder);
    console.log('FW :' , forwarder)
}
