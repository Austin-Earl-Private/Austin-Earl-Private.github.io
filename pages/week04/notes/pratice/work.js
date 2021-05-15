const form1 = document.forms['search'];
// const [input,button] = form.elements;
const input1 = form1['searchInput']

// INIT THE FORM
input1.placeholder = "Search here"

function attachFocus() {
    input1.addEventListener('focus', () => console.log('focused'), false);
}

function attachBlur() {
    input1.addEventListener('blur', () => console.log('blurred'), false);
}

function attachChange() {
    input1.addEventListener('change', () => console.log('changed'), false);
}

form1.addEventListener ('submit', search, false);
function search() {
    alert(`You Searched for: ${input1.value}`);
    event.preventDefault();
}

// Set up Hero class
class Hero {
    constructor(heroName=""){
        this.name = heroName;
    }

    getHeroName(){
        return this.name;
    }

    setHeroName(name){
        this.name = name;
    }
    setHeroDescription(description){
        this.description = description;
    }
    getHeroDescription(){
        return this.description;
    }
    // This powers should be an array
    setPowers(powers){
        this.powers = powers;
    }
    getPowers(){
        return this.powers;
    }
}


// Set up hero form

const form2 = document.forms['hero'];
form2.addEventListener('submit', makeHero, false);

function makeHero(event) {
    event.preventDefault(); // prevent the form from being submitted
    const hero = new Hero(); // create an empty object
    hero.setHeroName(form2.heroName.value); // create a name property based on the input field's value
    hero.setHeroDescription(form2.heroDescription.value)
    hero.setPowers([...form2.powers].filter(box => box.checked).map(box => box.value));
    alert(JSON.stringify(hero)); // convert object to JSON string and display in alert dialog
    return hero;
}




