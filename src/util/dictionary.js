export default class Dictionary{
    constructor(copyFrom){
        copyFrom = (copyFrom instanceof Dictionary) ? copyFrom : null;
        this.words = copyFrom ? copyFrom.getWords() : [];
    }

    addWord(word, english, type){
        this.words.push({word, english, type});
        this.words.sort((a, b) => {
            return a.word.localeCompare(b.word);
        });
    }

    changeEnglish(word, newEnglish){
        this.words = this.words.map((w) => {
            if(w.word === word){
                w.english = newEnglish
            }

            return w;
        })
    }

    export(){

    }

    getOnlyWords(){
        return this.words.map(w => w.word);
    }

    getWords(){
        return this.words.filter((w) => w);
    }
}