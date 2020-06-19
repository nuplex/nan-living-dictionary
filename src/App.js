import React from 'react';
import Generator from './util/generator.js';
import './App.scss';
import Dictionary from "./util/dictionary";
import RootGenerator from "./RootGenerator";
import WORD_TYPES from "./word-types";
import RootCombiner from "./RootCombiner";
import UndoDeleteStore from "./util/undo-delete-store";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            adjectiveActive: false,
            verbActive: false,
            wordType: '',
            syllables: 2,
            english: '???',
            dict: new Dictionary(),
            canUndo: false,
            undoDeleteStore: new UndoDeleteStore(),
            changingEnglishIndex: -1,
            changingEnglishValue: '',
            currentTab: 0,
            search: ''
        };

        this.add = this.add.bind(this);
        this.changeEnglish = this.changeEnglish.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.deleteWord = this.deleteWord.bind(this);
        this.onChangeChangingEnglish = this.onChangeChangingEnglish.bind(this);
        this.onChangeDictionary = this.onChangeDictionary.bind(this);
        this.onChangeEnglish = this.onChangeEnglish.bind(this);
        this.onChangeSyllables = this.onChangeSyllables.bind(this);
        this.onLeaveSearch = this.onLeaveSearch.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onUndoDelete = this.onUndoDelete.bind(this);
        this.stopChangingEnglish = this.stopChangingEnglish.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
    }

    add() {
        let gen = new Generator();
        let word = gen.createWord(this.state.syllables, this.state.english, this.state.wordType, this.state.dict.getOnlyWords());

        this.onChangeDictionary(word, this.state.english, this.state.wordType);
    }

    changeEnglish(index, value) {
        if (this.state.changingEnglishIndex === -1) {
            this.setState({
                changingEnglishIndex: index,
                changingEnglishValue: value
            })
        }
    }

    changeTab(tab) {
        if(this.state.currentTab !== tab){

            if (this.state.currentTab === 2) {
                this.onLeaveSearch();
            }

            this.setState({
                currentTab: tab
            });
        }
    }

    deleteWord(word) {
        this.state.undoDeleteStore.put(word);
        this.state.dict.deleteWord(word.word);
        const newDict = new Dictionary(this.state.dict);
        this.setState({
            dict: newDict,
            changingEnglishIndex: -1, // this option is also open at the moment at this index
            canUndo: true
        });
    }

    onChangeDictionary(word, english, type) {
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

    onLeaveSearch() {
        this.setState({
            search: ''
        });
    }

    onSearch(event) {
        this.setState({
            search: event.target.value
        });
    }

    onUndoDelete() {
        const word = this.state.undoDeleteStore.get();
        this.setState({
            canUndo: false
        }, () => this.onChangeDictionary(word.word, word.english, word.type))
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

    stopChangingEnglish(word) {
        let newDict = new Dictionary(this.state.dict);
        newDict.changeEnglish(word, this.state.changingEnglishValue);

        this.setState({
            dict: newDict,
            changingEnglishIndex: -1,
            changingEnglishValue: ''
        })
    }

    renderDictionary(search) {
        const {dict, changingEnglishIndex, changingEnglishValue} = this.state;

        return (
            <div className="dict-cont">
                {dict.getWords().map((entry, i) => {
                    if (search && !entry.word.includes(search) && !entry.english.includes(search)) {
                       return null;
                    }

                    let isRoot = entry.type === WORD_TYPES.ROOT;
                    let nanEntryClass = !isRoot ? 'nan-entry' : 'nan-entry__root';

                    return (
                        <div className="entry" key={i + entry.word}>
                            <span className={nanEntryClass}>{entry.word}</span>
                            <span>{' '}</span>
                            {(changingEnglishIndex !== i) ?
                                <span className="english-entry"
                                      onClick={() => this.changeEnglish(i, entry.english)}
                                >{entry.english}</span>
                                :
                                <div className="changing-english-cont">
                                    <input type="test"
                                           onChange={this.onChangeChangingEnglish}
                                           onKeyDown={(e) => {
                                               if (e.key === 'Enter') this.stopChangingEnglish(entry.word)
                                           }}
                                           value={changingEnglishValue}
                                    />
                                    <button onClick={() => this.stopChangingEnglish(entry.word)}>Change English</button>
                                    <button onClick={() => this.deleteWord(entry)}>Delete Word</button>
                                </div>
                            }
                            {isRoot &&
                            <div className="root-badge">root</div>
                            }
                        </div>
                    )
                })}
            </div>
        )
    }

    renderMainGenerator() {
        const {adjectiveActive, verbActive, dict, syllables, english} = this.state;
        const adjectiveClass = "option" + (adjectiveActive ? "__active" : "");
        const verbClass = "option" + (verbActive ? "__active" : "");

        return (
            <React.Fragment>
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
                        >Adjective
                        </div>
                        <div className={verbClass}
                             onClick={() => this.toggleActive('VRB')}
                        >Verb
                        </div>
                    </div>
                    <button onClick={this.add}>Add Word</button>
                </div>
                <RootGenerator dict={dict}
                               onChangeDictionary={this.onChangeDictionary}
                />
            </React.Fragment>
        )
    }

    renderSearch(){
        const { search } = this.state;

        return (
            <div className="search">
                <label htmlFor="search">
                    <input name="search"
                           type="text"
                           onChange={this.onSearch}
                           value={search}
                    />
                </label>
            </div>
        )
    }

    render() {
        const {currentTab, dict, search, canUndo} = this.state;
        let tabActive = (tab) => tab === currentTab ? 'tab__active':'tab';

        return (
            <div className="main">
                <h1>Nan Living Dictionary</h1>
                <div>
                    <span className={tabActive(0)}
                          onClick={() => this.changeTab(0)}>Generate</span>
                    {` `}
                    <span className={tabActive(1)}
                          onClick={() => this.changeTab(1)}>Combine</span>
                    {` `}
                    <span className={tabActive(2)}
                          onClick={() => this.changeTab(2)}>Search</span>
                </div>
                {currentTab === 0 &&
                    this.renderMainGenerator()
                }
                {currentTab === 1 &&
                    <RootCombiner
                        dict={dict}
                        onChangeDictionary={this.onChangeDictionary}
                    />
                }
                {currentTab === 2 &&
                    this.renderSearch()
                }
                {this.renderDictionary(search === '' ? null : search)}
                {canUndo &&
                    <div className="undo-delete-button"
                         onClick={this.onUndoDelete}
                    >Undo Delete</div>
                }
            </div>
        );
    }
}

export default App;
