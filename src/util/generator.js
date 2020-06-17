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

    createWord(syllables, english, type, collisionDetector){
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

        let coreProcess = () => {
            let toReturn = word;
            toReturn += this.initial();

            if (syllables >= 2){
                let left = syllables - 2; //minus initial and final

                while(left > 0){
                    toReturn += this.medial();
                    --left;
                }
            }

            toReturn += this.final();

            return toReturn;
        };

        let isDuplicate = true;

        while(isDuplicate){
            let generated = coreProcess();
            isDuplicate = false;

            if (collisionDetector) {
                isDuplicate = collisionDetector.indexOf(generated) !== -1;
            }

            if(!isDuplicate){
                word = generated;
            }
        }

        return word;
    }

    createWordFromRoots(roots, wildSyllables, english, type, collisionDetector){
        //roots are add like root 2 + root 1
        //roots with boundaries like VV become VCV where C = y
        //roots with boundaries like CC become CVC where V = i
        let onlyRoots = roots.map((r) => r.word);

        const getLastChar = root => root[root.length - 1];
        const getFirstChar = root => root[0];
        const isVowel =  char => this.vowels.indexOf(char) !== -1;
        const generateBoundary = (a, b) => {
            if(isVowel(getLastChar(a)) && isVowel(getFirstChar(b))){
                return 'y';
            } else if (!isVowel(getLastChar(a)) && !isVowel(getFirstChar(b))) {
                return 'i';
            }

            return '';
        };

        let word = '';

        for(let i = 0; i < onlyRoots.length; i++){
            let root = onlyRoots[i];

            root = root === 'WILD' ? this.createWord(wildSyllables, english, type, collisionDetector) : root;

            if (i === onlyRoots.length - 1) {
                word += root;
            } else {
                word += root + generateBoundary(root, onlyRoots[i + 1]);
            }
        }

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