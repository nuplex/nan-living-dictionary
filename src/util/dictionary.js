import WORD_TYPES from "../word-types";

export default class Dictionary{
    constructor(copyFrom) {
        copyFrom = (copyFrom instanceof Dictionary) ? copyFrom : null;
        this.words = copyFrom ? copyFrom.getWords() : [];
    }

    addWord(word, english, type) {
        this.words.push({word, english, type});
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