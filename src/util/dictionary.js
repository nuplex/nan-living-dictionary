import WORD_TYPES from "../word-types";

export default class Dictionary{
    constructor(copyFrom) {
        if (Array.isArray(copyFrom)) {
            this.words = [...copyFrom];
        } else {
            copyFrom = (copyFrom instanceof Dictionary) ? copyFrom : null;
            this.words = copyFrom ? copyFrom.getWords() : [];
        }
    }

    addWord(word, english, roots, type) {
        let wordsOnlyRoots = roots ? roots.map(r => r.word) : null;
        this.words.push({word, english, wordsOnlyRoots, type});
        this.words.sort((a, b) => {
            return a.word.localeCompare(b.word);
        });
    }

    changeEnglish(word, newEnglish) {
        this.words = this.words.map((w) => {
            if(w.word === word){
                w.english = newEnglish
            }

            return w;
        })
    }

    deleteWord(word) {
        this.words = this.words.filter((w) => w.word !== word);
    }

    export() {

    }

    findWord(word) {
        return this.words.some(w => w.word === word);
    }

    getOnlyWords() {
        return this.words.map(w => w.word);
    }

    getRoots() {
        return this.words.filter(w => w.type === WORD_TYPES.ROOT);
    }

    getWords() {
        return this.words.filter((w) => w);
    }
}
