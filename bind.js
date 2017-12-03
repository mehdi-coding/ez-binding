let identifiers = ['{{', '}}']
let ezModel = {};
let binders = {};
ezModel.aze = "Great"; ezModel.another = "Finally";
 
function getAllBindings() {

    let modElemts = Array.from(document.querySelectorAll('[ez-Model]'))

    let bindings = [];

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
    })

    return bindings;
}

function updateBindings(binder) {
    if (binder.element.nodeName == "INPUT") {
        // Init the variable if doesn't exist ...
        if (!ezModel[binder.variables[0]]){
            ezModel[binder.variables[0]] = '';
        } 
        // Update the value of the element
        binder.element.value = ezModel[binder.variables[0]]
    }
    else {
        let txt = '';
        // Reconstruct the textContent from original
        binder.variables.forEach((v, i) => {
            if (!ezModel[v]) {
                ezModel[v] = '';
            }
            txt += binder.content[i] + ezModel[v]
        })
        txt += binder.content[binder.content.length - 1];
        // Update the textContent
        binder.element.textContent = txt;
    }
}

// add event listners
function initEvents(binder) {
    if (binder.element.nodeName == "INPUT") {
        binder.element.addEventListener('input', function (evt) {
            ezModel[binder.variables[0]] = evt.target.value;
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

window.onload = () => {
    binders = getAllBindings();
    binders.forEach(binder => {
        updateBindings(binder);
        initEvents(binder)
    })

    ezModel = new Proxy(ezModel, linker);
}

let linker = {
    set: function (obj, vari, value) {
        // Validate

        if (value ==  obj[vari]) return false
        obj[vari] = value;

        let bin = [];
        binders.forEach(binder => {
            if (binder.variables.indexOf(vari) > -1) bin.push(binder)
        })

        bin.forEach(b => {
            updateBindings(b)
        })
        // Indicate success
        return true;
    }
};