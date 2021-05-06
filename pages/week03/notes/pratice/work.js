let calculator = {
    prop:0,
    prop2:0,
    total:0,
    read(){
        this.prop = parseFloat(prompt("Please enter Number 1!")) || 0
        this.prop2 = parseFloat(prompt("Please enter Number 2!")) || 0

    },
    print(){
        console.log(`total:${this.total}`)
    },
    build(){
        return this.total;
    },
    // WHY????? cause why not ;) I thought a chained calculator would be cool!
    printChain(){
        this.print()
        return this
    },
    readChain(){
        this.read()
        return this
    }
    ,
    // Why do I have numb arround here??? cause I want to overload functions but sike!
    // you cant cause there is no function overloading... time for varable verification.
    sum(numb){
        this.total = ((this.total + numb) || (this.prop+this.prop2))
        return this
    },
    mult(numb){
        this.total = ((this.total * numb) || (this.prop*this.prop2))
        return this
    },
    divd(numb){
        this.total = ((this.total / numb) || (this.prop/this.prop2))
        return this
    },
    subrt(numb){
        this.total = ((this.total - numb) || (this.prop-this.prop2))
        return this
    },
    setParam1(numb1){
        this.prop = numb1;
    },
    setParam2(numb2){
        this.prop2 = numb2;
    },
    setParams(numb1,numb2){
        this.setParam1(numb1);
        this.setParam2(numb2);
        return this;
    }
}

console.log("  ;,//;,    ,;/\n o:::::::;;///\n>::::::::;;\\\\\\\n  ''\\\\\\\\\'\" ';\\");
console.log("Foosh")
// calculator.readChain().sum().printChain().mult().printChain().subrt().printChain().mult(4).printChain().subrt(3).print();

function updateParam1(e){
    calculator.prop = parseFloat(e.target.value) || 0
    console.log(`pram1 set to: ${calculator.prop}`)
}
function updateParam2(e){
    calculator.prop2 = parseFloat(e.target.value) || 0
    console.log(`pram2 set to: ${calculator.prop2}`)
}

function display(){
    document.getElementById("output").innerText = calculator.total
}
function add() {
    calculator.sum()
    display()
}
function subrt() {
    calculator.subrt()
    display()

}
function mult() {
    calculator.mult()
    display()

}
function divd() {
    calculator.divd()
    display()

}
function executeOrder66(){
    console.log("-----------runing scarry code!--------------")
    eval(`${document.getElementById('scary').value}; `)
    console.log("-----------finished scarry code!--------------")
}

document.getElementById("input1").addEventListener('input', updateParam1)
document.getElementById("input2").addEventListener('input', updateParam2)
document.getElementById("add").addEventListener('click', add)
document.getElementById("sub").addEventListener('click', subrt)
document.getElementById("mult").addEventListener('click', mult)
document.getElementById("divd").addEventListener('click', divd)
document.getElementById("runScary").addEventListener('click',executeOrder66)

//  I see you in here ;)