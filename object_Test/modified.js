let binders = [];
let identifiers = ['{{', '}}'];
let ez = {};
let setFunctionname = 'SetFunction'
let getFunctionname = 'GetFunction'

let linker = {
    set: function (obj, vari, newVal) {
        let tempVal = newVal

        if (obj[vari + setFunctionname] != null) {
            if (typeof obj[vari + setFunctionname] === 'function') {
                tempVal = obj[vari + setFunctionname](obj, vari, newVal)
            } else console.warn('The Set of the variable (', vari, ') is not a function, Get & Set must be functions returning a value ...');
        }

        // if the old value equal the new value no need to change
        if (tempVal == obj[vari]) return false
        // Set the New Value
        obj[vari] = tempVal;

        // // Get all the elements related to the 
        // let bin = [];
        // binders.forEach(binder => {
        //     if (binder.variables.indexOf(vari) > -1) bin.push(binder)
        // })
        // // Update each Element
        // bin.forEach(b => {
        //     updateBindings(b)
        // })
        // // Indicate success
        // return true;
    },
    get: function (obj, vari) {
        if (typeof obj[vari] === 'object' && obj[vari] !== null) {
            return new Proxy(obj[vari], linker)
        } else {
            if (obj[vari + getFunctionname] != null) {
                if (typeof obj[vari + getFunctionname] === 'function') {
                    return obj[vari + getFunctionname](obj, vari)
                } else console.warn('The Get of the variable (', vari, ') is not a function, Get & Set must be functions returning a value ...');
            }

            return obj[vari];
        }
    }
};

window.onload = () => {
    getAllBindings()
    binders.forEach(binder => {
        updateBindings(binder);
        initEvents(binder)
    })

    ez = new Proxy(ez, linker);

    // ez = new Proxy(ez, validator)



    function getAllBindings() {
        // Get all elements that have attribute ez-model
        let modElemts = Array.from(document.querySelectorAll('[ez-Model]'));
        console.log(modElemts);
        // Go for each element
        modElemts.forEach((modElem) => {
            // If the nodes are input or select no need to check innerHTML, we use Values
            if (modElem.nodeName == "INPUT" || modElem.nodeName == "SELECT") {
                let binder = {
                    element: modElem,
                    variables: [[modElem.getAttribute('ez-Model')]],
                    content: []
                }
                binders.push(binder);
            } else
            // We are in text elements
            {
                let variables = [];
                let content = [];

                // Get the innerHTML of the element
                let txt = modElem.innerHTML;
                // split by {{ to find the variable
                let spb = txt.split(identifiers[0]);
                // There is no variable enclosed by {{ variable }}
                if (spb.length == 1) return false;
                // Continue
                else {
                    // Get the first part of the text for recustruction later
                    content.push(spb[0])
                    // remove the first part of HTML
                    spb = spb.slice(1)
                    spb.forEach(sp => {
                        // Split by the second part }}
                        let temp = sp.split(identifiers[1]);
                        // Get the object properties to be passed to variable
                        variables.push(temp[0].trim().split('.'));
                        // Get the contetnt
                        content.push(temp[1])
                    })
                    // Add the binding object to the list
                    let binder = {
                        element: modElem,
                        variables: variables,
                        content: content
                    }
                    binders.push(binder);
                }
            }
        })
    }

}

// add event listners
function initEvents(binder) {
    if (binder.element.nodeName == "INPUT") {
        binder.element.addEventListener('input', function (evt) {
            setVariableValue(binder.variables[0], evt.target.value);
        });
    } else if (binder.element.nodeName == "SELECT") {
        binder.element.addEventListener('change', function (evt) {
            setVariableValue(binder.variables[0], evt.target.value);
        });
    }
}

function updateBindings(binder) {
    if (binder.element.nodeName == "INPUT" || binder.element.nodeName == "SELECT") {
        // Init the variable if doesn't exist ...ez[binder.variables[0]]
        let value = getVariableValue(binder.variables[0]);
        if (value == null) {
            setVariableValue(binder.variables[0], binder.element.value);
        }
        // Update the value of the element
        binder.element.value = value
    }
    else {
        let txt = '', b = '';
        // Reconstruct the textContent from original
        binder.variables.forEach((v, i) => {
            let value = getVariableValue(v);
            if (value == null || undefined) value = ''
            b = binder.content[i];
            if (b == null || b == undefined) b = '';

            txt += b + value
        })
        b = binder.content[binder.content.length - 1];
        if (b == null || b == undefined) b = '';

        txt += b;
        // Update the innerHTML
        binder.element.innerHTML = txt;
    }
}

// Get the value of the oobject from the passed properties array
function getVariableValue(varObjArray) {
    let valueGetter = (accumulator, property, ind, arr) => {
        if (accumulator[property] == null) {
            if (ind == arr.length - 1) accumulator[property] = null
            else accumulator[property] = {}
        }
        return accumulator[property]
    }
    return varObjArray.reduce(valueGetter, ez)
}

// Set the value of the oobject from the passed properties array
function setVariableValue(varObjArray, value) {
    let valueGetter = (accumulator, property, ind, arr) => {
        if (ind == arr.length - 1) accumulator[property] = value
        if (accumulator[property] == null) {
            accumulator[property] = {}
        }
        return accumulator[property]
    }
    return varObjArray.reduce(valueGetter, ez)
}

// Set the value of the oobject from the passed properties array
function getObjFromArray(varObjArray) {
    let valueGetter = (accumulator, property, ind, arr) => {
        if (ind == arr.length - 1) {
            return accumulator;
        } else {
            if (accumulator[property] == null) {
                if (ind == arr.length - 1) accumulator[property] = null
                else accumulator[property] = {}
            }
            return accumulator[property]
        }
    }
    return varObjArray.reduce(valueGetter, ez)
}























//     ez.addGS= (obj)=> {
//         if (obj.variableName == undefined) console.warn('variableName is undefined, when adding getters and setters please specify the target by the variable name');
//         else if (obj.variableName == null) console.warn('variableName is null, when adding getters and setters please specify the target by the variable name')
//         else{
//             ezGS[obj.variableName] = {
//                 get: obj.get,
//                 set: obj.set
//             }
//         }
//     }
// }