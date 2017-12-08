let identifiers = ['{{', '}}']
let ez = {};

window.onload = () => {
    let ezGS = {}
    let binders = [];
    let linker = {
        set: function (obj, vari, value) {
            let tempVal = value;

            if (ezGS[vari] != null && ezGS[vari].set != null) {
                if (typeof ezGS[vari].set === 'function'){
                    tempVal = ezGS[vari].set(value, obj[vari]);
                    console.log(tempVal);
                }
                else console.warn('The Set of the variable (', vari, ') is not a function, Get & Set must be functions returning a value ...');
            }

            // if the old value equal the new value no need to change
            if (tempVal == obj[vari]) return false
            // Set the New Value
            obj[vari] = tempVal;
            // Get all the elements related to the 
            let bin = [];
            binders.forEach(binder => {
                if (binder.variables.indexOf(vari) > -1) bin.push(binder)
            })
            // Update each Element
            bin.forEach(b => {
                updateBindings(b)
            })
            // Indicate success
            return true;
        },

        get: function (obj, vari) {

            if (ezGS[vari] != null && ezGS[vari].get != null) {
                if (typeof ezGS[vari].get === 'function'){
                    return ezGS[vari].get(obj[vari]);
                }
                else console.warn('The Get of the variable (', vari, ') is not a function, Get & Set must be functions returning a value ...'); 
            }
            return obj[vari];
        }
    };

    binders = getAllBindings();
    console.log(binders);
    binders.forEach(binder => {
        updateBindings(binder);
        initEvents(binder)
    })

    ez = new Proxy(ez, linker);

    function getAllBindings() {
        // Get all elements that have attribute ez-model
        let modElemts = Array.from(document.querySelectorAll('[ez-Model]'))
        let bindings = [];
        // Go for each element
        modElemts.forEach((modElem) => {
            let childs = modElem.childNodes;
            if (Array.from(childs).length == 0) {
                let binder = {
                    element: modElem,
                    variables: [modElem.getAttribute('ez-Model')],
                    content: []
                }
                bindings.push(binder);

            } else {
                if (modElem.nodeName == "SELECT") {
                    let binder = {
                        element: modElem,
                        variables: [modElem.getAttribute('ez-Model')],
                        content: []
                    }
                    bindings.push(binder);
                } else {
                    childs.forEach(c => {
                        let vars = []
                        if (vars = getVariables(c)) {
                            let staticTxt = []
                            staticTxt[0] = c.textContent;

                            vars.forEach(v => {
                                let tbspit = staticTxt[staticTxt.length - 1];
                                staticTxt.splice(-1, 1);
                                staticTxt = staticTxt.concat(tbspit.split(identifiers[0] + v + identifiers[1]))
                            })

                            let binder = {
                                element: c,
                                variables: vars.map(vr => vr.trim()),
                                content: staticTxt
                            }
                            bindings.push(binder);
                        }
                    })
                }
            }
        })

        return bindings;
    }

    function updateBindings(binder) {
        if (binder.element.nodeName == "INPUT" || binder.element.nodeName == "SELECT") {
            // Init the variable if doesn't exist ...
            if (ez[binder.variables[0]] == null) {
                ez[binder.variables[0]] = binder.element.value;
            }
            // Update the value of the element
            binder.element.value = ez[binder.variables[0]]
        }
        else {
            let txt = '', b = '';
            // Reconstruct the textContent from original
            binder.variables.forEach((v, i) => {
                let value = ez[v];
                if (value == null || undefined) value = ''
                b = binder.content[i];
                if (b == null || b == undefined) b = '';

                txt += b + value
            })
            b = binder.content[binder.content.length - 1];
            if (b == null || b == undefined) b = '';

            txt += b;
            // Update the textContent
            binder.element.textContent = txt;
        }
    }

    // add event listners
    function initEvents(binder) {
        if (binder.element.nodeName == "INPUT") {
            binder.element.addEventListener('input', function (evt) {
                ez[binder.variables[0]] = evt.target.value;
            });
        } else if (binder.element.nodeName == "SELECT") {
            binder.element.addEventListener('change', function (evt) {
                ez[binder.variables[0]] = evt.target.value;
            });
        }
    }

    function getVariables(ele) {
        let txt = ele.textContent;
        let sp = txt.split(identifiers[0]);

        if (sp.length == 1) return false;
        else {
            sp = sp.slice(1)
            let vv = sp.map(ss => {
                return ss.split(identifiers[1])[0];
            })

            return vv
        }
    }

    ez.addGS= (obj)=> {
        if (obj.variableName == undefined) console.warn('variableName is undefined, when adding getters and setters please specify the target by the variable name');
        else if (obj.variableName == null) console.warn('variableName is null, when adding getters and setters please specify the target by the variable name')
        else{
            ezGS[obj.variableName] = {
                get: obj.get,
                set: obj.set
            }
        }
    }
}