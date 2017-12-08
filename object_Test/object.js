function test() {
    // setVariableValue(binders[2].variables[1], "Blah Badi ...")

    // console.log(binders[2].variables[1]);

    // oo = getVariableValue(binders[2].variables[1])
    // console.log(oo);

    // pp = getObjFromArray(binders[2].variables[1])
    // console.log(pp);
    binders.forEach(b => updateBindings(b))
    ez.user.name = "Mehdi";
    ez.user.email = "email@gmail.com"
    binders.forEach(b => updateBindings(b))
    
    
}
