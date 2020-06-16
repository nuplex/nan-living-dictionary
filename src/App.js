import React from 'react';
import Generator from './util/generator.js';
import './App.css';
import Dictionary from "./util/dictionary";
import RootGenerator from "./RootGenerator";
import WORD_TYPES from "./word-types";

class App extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            adjectiveActive: false,
            verbActive: false,
            wordType: '',
            syllables: 2,
            english: '???',
            dict: new Dictionary(),
            changingEnglishIndex: -1,
            changingEnglishValue: ''
        };

        this.add = this.add.bind(this);
        this.onChangeSyllables = this.onChangeSyllables.bind(this);
        this.onChangeEnglish = this.onChangeEnglish.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
        this.changeEnglish = this.changeEnglish.bind(this);
        this.onChangeChangingEnglish = this.onChangeChangingEnglish.bind(this);
        this.stopChangingEnglish = this.stopChangingEnglish.bind(this);
        this.onChangeDictionary = this.onChangeDictionary.bind(this)
    }

    add(){
        let gen = new Generator();
        let word = gen.createWord(this.state.syllables, this.state.english, this.state.wordType, this.state.dict.getOnlyWords());

        this.onChangeDictionary(word, this.state.english, this.state.wordType);
    }

    changeEnglish(index, value){
        if(this.state.changingEnglishIndex === - 1) {
            this.setState({
                changingEnglishIndex: index,
                changingEnglishValue: value
            })
        }
    }

    onChangeDictionary(word, english, type){
        let newDict = new Dictionary(this.state.dict);
        newDict.addWord(word, english, type);

        this.setState({
            dict: newDict,
            english: '???'
        });
    }

    onChangeChangingEnglish(event) {
        this.setState({
            changingEnglishValue: event.target.value
        })
    }

    onChangeEnglish(event) {
        this.setState({
            english: event.target.value
        });
    }

    onChangeSyllables(event) {
        this.setState({
            syllables: parseInt(event.target.value)
        });
    }

    toggleActive(type) {
        if ((this.state.adjectiveActive && !this.state.verbActive && type === 'VRB') ||
            (!this.state.adjectiveActive && this.state.verbActive && type === 'ADJ')
        ) {
            this.setState({
                adjectiveActive: false,
                verbActive: false,
                wordType: ''
            });
        } else {
            switch (type) {
                case 'ADJ':
                    this.setState({
                        adjectiveActive: !this.state.adjectiveActive,
                        wordType: type
                    });
                    break;
                case 'VRB':
                    this.setState({
                        verbActive: !this.state.verbActive,
                        wordType: type
                    });
                    break;
                default:
                    break;
            }
        }
    }

    stopChangingEnglish(word){
        let newDict = new Dictionary(this.state.dict);
        newDict.changeEnglish(word, this.state.changingEnglishValue);

        this.setState({
            dict: newDict,
            changingEnglishIndex: -1,
            changingEnglishValue: ''
        })
    }

    render() {
        const {adjectiveActive, verbActive, dict, syllables, english, changingEnglishIndex, changingEnglishValue} = this.state;
        const adjectiveClass = "option" + (adjectiveActive ? "__active" : "");
        const verbClass = "option" + (verbActive ? "__active" : "");

        return (
            <div className="main">
                <h1>Nan Living Dictionary</h1>
                <div className="add-cont">
                    <label htmlFor="syllables">
                        <input name="syllables"
                               type="number"
                               onChange={this.onChangeSyllables}
                               value={syllables}
                        />
                    </label>
                    <label htmlFor="english">
                        <input name="english"
                               type="text"
                               onChange={this.onChangeEnglish}
                               value={english}
                        />
                    </label>
                    <div className="type">
                        <div className={adjectiveClass}
                           onClick={() => this.toggleActive('ADJ')}
                        >Adjective</div>
                        <div className={verbClass}
                           onClick={() => this.toggleActive('VRB')}
                        >Verb</div>
                    </div>
                    <button onClick={this.add}>Add Word</button>
                </div>
                <RootGenerator dict={dict}
                               onChangeDictionary={this.onChangeDictionary}
                />
                <div className="dict-cont">
                    {dict.getWords().map((entry, i) => {
                        let isRoot = entry.type === WORD_TYPES.ROOT;
                        let nanEntryClass =  !isRoot ? 'nan-entry' : 'nan-entry__root';

                        return (
                            <div className="entry" key={i + entry.word}>
                                <span className={nanEntryClass}>{entry.word}</span>
                                <span>{' '}</span>
                                { (changingEnglishIndex !== i) ?
                                    <span className="english-entry"
                                          onClick={() => this.changeEnglish(i, entry.english)}
                                    >{entry.english}</span>
                                    :
                                    <div className="changing-english-cont">
                                        <input type="test"
                                               onChange={this.onChangeChangingEnglish}
                                               onKeyDown={(e) =>{if (e.key === 'Enter') this.stopChangingEnglish(entry.word)}}
                                               value={changingEnglishValue}
                                        />
                                        <button onClick={() => this.stopChangingEnglish(entry.word)}>Submit</button>
                                    </div>
                                }
                                { isRoot &&
                                    <div className="root-badge">root</div>
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default App;
