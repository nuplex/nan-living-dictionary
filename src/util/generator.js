export default class Generator {
    constructor() {
        this.vowels = ['a', 'u', 'i'];
        this.initials = ['m', 'n', 'sh', 'y'];
        this.medials = [...this.initials, 'd', 'b', 'g'];
        this.dipthong = 'ai';
        this.finalNasals = ['m', 'n'];
        this.finalSh = 'sh';

        this.adjective = `na'`;
        this.verb = `shi'`
    }

    createWord(syllables, english, type){
        let word = '';

        switch(type){
            case 'ADJ':
                word += this.adjective;
                break;
            case 'VRB':
                word += this.verb;
                break;
            default:
                break;
        }

        word += this.initial();

        if (syllables >= 2){
            let left = syllables - 2; //minus initial and final

            while(left > 0){
                word += this.medial();
                --left;
            }
        }

        word += this.final();

        return word;
    }

    final() {
        let finalVowel = this.getRandomInt(100) === 50 ? this.dipthong : this.randomVowel();
        let finalInitialConsonant = this.getRandomChar(this.medials);
        let finalFinalConsonant = this.getRandomInt(25) === 24 ? this.finalSh : this.getRandomChar(this.finalNasals);
        let useFinalFinalConsonant = this.getRandomInt(8) === 4;
        let useOnlyFinalFinalConsonant = useFinalFinalConsonant ? this.getRandomInt(2) === 1 : false;

        if (!useFinalFinalConsonant) {
            finalFinalConsonant = '';
        }

        if (useOnlyFinalFinalConsonant && finalFinalConsonant === '') {
            useOnlyFinalFinalConsonant = false;
        }

        let fin;

        if (useOnlyFinalFinalConsonant) {
            fin = finalFinalConsonant;
        } else {
            fin = finalInitialConsonant + finalVowel + finalFinalConsonant;
        }

        return fin;
    }

    initial() {
        let set;
        let initialVowel = this.getRandomInt(2) === 1;
        set = initialVowel ? this.vowels : this.initials;

        let init = this.getRandomChar(set);

        if (!initialVowel) {
            init = init + this.randomVowel();
        }

        return init;
    }

    getRandomChar(arr) {
        return arr[this.getRandomInt(arr.length)];
    }


    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    medial() {
        let medialVowel = this.getRandomInt(100) === 50 ? this.dipthong : this.randomVowel();

        return this.getRandomChar(this.medials) + medialVowel;
    }

    randomVowel() {
        return this.getRandomChar(this.vowels);
    }
}