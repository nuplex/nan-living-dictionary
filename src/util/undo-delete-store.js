export default class UndoDeleteStore {
    constructor(deletedWord) {
        this.deletedWord = deletedWord;
    }

    put(word) {
        this.deletedWord = word;
    }

    get() {
        const word = this.deletedWord;
        this.deletedWord = null;
        return word;
    }
}