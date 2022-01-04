import React from 'react';
import Generator from './util/generator.js';
import './App.scss';
import * as Api from './util/api';
import Dictionary from "./util/dictionary";
import LessonBook from "./util/lesson-book";
import LessonCreator from "./LessonCreator";
import LESSON_MODES from "./lesson-modes";
import LessonViewer from "./LessonViewer";
import RootGenerator from "./RootGenerator";
import RootCombiner from "./RootCombiner";
import UndoDeleteStore from "./util/undo-delete-store";
import WordCreator from './WordCreator';
import WORD_TYPES from "./word-types";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.TABS = {
            LESSONS: 10,
            ADD_LESSON: 11,
            EDIT_LESSON: 12,
            ADD_WORD: 2,
            GENERATE: 3,
            COMBINE: 4,
            SEARCH: 5
        };

        this.state = {
            adjectiveActive: false,
            canUndo: false,
            changingEnglishIndex: -1,
            changingEnglishValue: '',
            currentTab: 0,
            deleteOnServerStack: [],
            dict: new Dictionary(),
            english: '???',
            lessonViewerLesson: null,
            lessonBook: new LessonBook(),
            nounActive: false,
            saveText: 'Save',
            search: '',
            showLessonEditor: false,
            showLessonViewer: false,
            showLoading: false,
            syllables: 2,
            undoDeleteStore: new UndoDeleteStore(),
            verbActive: false,
            wordType: '',
        };

        this.add = this.add.bind(this);
        this.cancelWordSelection = this.cancelWordSelection.bind(this);
        this.changeEnglish = this.changeEnglish.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.deleteWord = this.deleteWord.bind(this);
        this.onChangeChangingEnglish = this.onChangeChangingEnglish.bind(this);
        this.onChangeDictionary = this.onChangeDictionary.bind(this);
        this.onChangeEnglish = this.onChangeEnglish.bind(this);
        this.onChangeLessonBook = this.onChangeLessonBook.bind(this);
        this.onChangeSyllables = this.onChangeSyllables.bind(this);
        this.onCloseLessonViewer = this.onCloseLessonViewer.bind(this);
        this.onCloseLessonEditor = this.onCloseLessonEditor.bind(this);
        this.onEditLesson = this.onEditLesson.bind(this);
        this.onLeaveSearch = this.onLeaveSearch.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onUndoDelete = this.onUndoDelete.bind(this);
        this.save = this.save.bind(this);
        this.stopChangingEnglish = this.stopChangingEnglish.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
        this.triggerLessonViewer = this.triggerLessonViewer.bind(this);
    }

    componentDidMount() {
        Api.load()
            .then((res) => {
                const words = res.dictionary;
                words.sort((a, b) => {
                    return a.word.localeCompare(b.word);
                });

                this.setState({
                    dict: new Dictionary(words)
                });
            })
            .catch((error) => {
                console.log(JSON.stringify(error));
            });

        Api.loadLessons()
            .then((res) => {
                const lessons = res.lessons;
                lessons.sort((a, b) => {
                   return a.number - b.number;
                });

                this.setState({
                    lessonBook: new LessonBook(lessons)
                });
            });
    }

    add() {
        let gen = new Generator();
        let word = gen.createWord(this.state.syllables, this.state.english, this.state.wordType, this.state.dict.getOnlyWords());

        this.onChangeDictionary(word, this.state.english, null, this.state.wordType);
    }

    cancelWordSelection() {
        this.setState({
            changingEnglishIndex: -1,
            changingEnglishValue: ''
        });
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

            if (this.state.currentTab === this.TABS.SEARCH) {
                this.onLeaveSearch();
            }

            if (this.state.currentTab === this.TABS.EDIT_LESSON) {
                this.setState({
                    lessonViewerLesson: null,
                    showLessonEditor: false
                });
            }

            this.setState({
                currentTab: tab
            });
        }
    }

    deleteWord(word) {
        this.state.undoDeleteStore.put(word);
        this.state.deleteOnServerStack.push(word);
        this.state.dict.deleteWord(word.word);
        const newDict = new Dictionary(this.state.dict);
        this.setState({
            dict: newDict,
            changingEnglishIndex: -1, // this option is also open at the moment at this index
            canUndo: true
        });
    }

    onChangeDictionary(word, english, roots, type) {
        let newDict = new Dictionary(this.state.dict);
        newDict.addWord(word, english, roots, type);

        this.setState({
            dict: newDict,
            english: '???'
        });
    }

    onChangeLessonBook(lesson, mode) {
        let newLessonBook = new LessonBook(this.state.lessonBook);

        if (mode === LESSON_MODES.EDIT) {
            newLessonBook.updateLesson(lesson);
        } else {
            newLessonBook.addLesson(lesson);
        }


        this.setState({
           lessonBook: newLessonBook
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

    onCloseLessonEditor() {
        this.setState({
            lessonViewerLesson: null,
            showLessonEditor: false
        }, () => this.changeTab(this.TABS.LESSONS));
    }

    onCloseLessonViewer() {
        this.setState({
            showLessonViewer: false
        });
    }

    onEditLesson(lesson) {
        this.setState({
            lessonViewerLesson: lesson,
            showLessonEditor: true,
            showLoading: true
        }, () => {
            this.changeTab(this.TABS.EDIT_LESSON);
            this.setState({
                showLoading: false
            });
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
        if ((this.state.adjectiveActive && type === WORD_TYPES.MODIFIER) ||
            (this.state.verbActive && type === WORD_TYPES.VERB) ||
            (this.state.nounActive && type === WORD_TYPES.NOUN)
        ) {
            this.setState({
                adjectiveActive: false,
                nounActive: false,
                verbActive: false,
                wordType: ''
            });
        } else {
            switch (type) {
                case WORD_TYPES.MODIFIER:
                    this.setState({
                        adjectiveActive: !this.state.adjectiveActive,
                        nounActive: false,
                        verbActive:false,
                        wordType: type
                    });
                    break;
                case WORD_TYPES.NOUN:
                    this.setState({
                        adjectiveActive: false,
                        nounActive: !this.state.nounActive,
                        verbActive:false,
                        wordType: type
                    });
                    break;
                case WORD_TYPES.VERB:
                    this.setState({
                        adjectiveActive: false,
                        nounActive: false,
                        verbActive: !this.state.verbActive,
                        wordType: type
                    });
                    break;
                default:
                    break;
            }
        }
    }

    triggerLessonViewer(lesson) {
        this.setState({
            lessonViewerLesson: lesson,
            showLessonViewer: true
        });
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

    renderAdd() {
        return (
            <WordCreator
                dictionary={this.state.dict}
                onChangeDictionary={this.onChangeDictionary}
            />
        )
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
                                    <button onClick={() => this.cancelWordSelection()}>Cancel</button>
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

    renderLessonBook() {
        let lessons = this.state.lessonBook.getLessonsAs1DArray();

        return (
            <div className="lessonbook">
                {lessons.map((lesson, i) => {
                    return (
                        <div
                            className="lessonbook__lesson"
                            key={lesson.getTitle()+i}
                        >
                            <span
                                className="lessonbook__lesson-title"
                                onClick={() => this.triggerLessonViewer(lesson)}
                            >
                                {`${lesson.getNumber()} - ${lesson.getTitle()}`}
                            </span>
                            <button
                                className="lessonbook__lesson-edit-button"
                                onClick={() => this.onEditLesson(lesson)}
                            >
                                Edit
                            </button>
                        </div>
                    )
                })}
            </div>
        );
    }

    renderMainGenerator() {
        const {adjectiveActive, nounActive, verbActive, dict, syllables, english} = this.state;
        const adjectiveClass = "option" + (adjectiveActive ? "__active" : "");
        const verbClass = "option" + (verbActive ? "__active" : "");
        const nounClass = "option" + (nounActive ? "__active" : "");

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
                        <div className={nounClass}
                             onClick={() => this.toggleActive(WORD_TYPES.NOUN)}
                        >Noun
                        </div>
                        <div className={verbClass}
                             onClick={() => this.toggleActive(WORD_TYPES.VERB)}
                        >Verb
                        </div>
                        <div className={adjectiveClass}
                             onClick={() => this.toggleActive(WORD_TYPES.MODIFIER)}
                        >Modifier
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

    save() {
        const handleDeletion = (callback) => {
            let {deleteOnServerStack} = this.state;

            if (deleteOnServerStack.length <= 0) {
                callback();
                return;
            }

            this.setState({
              saveText: 'Saving deletions...'
            }, () => {
                Api.deleteWords(deleteOnServerStack)
                    .then((res) => {
                        this.setState({
                            deleteOnServerStack: []
                        }, callback);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));
                    });
            });
        };

        this.setState({
            saveText: 'Saving words...'
        }, () => {
            Api.save(this.state.dict)
                .then((res) => {
                    this.setState({
                        saveText: 'Saving lessons...'
                    }, () => {
                        Api.saveLessons(this.state.lessonBook)
                            .then((res) => {
                                handleDeletion(() => {
                                    this.setState({
                                        saveText: 'Saved.'
                                    }, () => setTimeout(() => {
                                        this.setState({
                                            saveText: 'Save'
                                        });
                                    }, 3000))
                                });
                            });
                    });

                })
                .catch((error) => {
                    console.log(JSON.stringify(error));
                });
        });
    }

    render() {
        const {
            currentTab,
            dict,
            lessonBook,
            lessonViewerLesson,
            showLessonEditor,
            showLessonViewer,
            showLoading,
            saveText,
            search,
            canUndo
        } = this.state;
        let tabActive = (tab) => tab === currentTab ? 'tab__active':'tab';
        let showDictionary = currentTab !== this.TABS.ADD_WORD && currentTab !== this.TABS.ADD_LESSON && currentTab !== this.TABS.LESSONS && currentTab !== this.TABS.EDIT_LESSON;

        return (
            <React.Fragment>
                <div className="main">
                    <h1>Nan Living Dictionary</h1>
                    <div>
                        <span className={tabActive(0)}
                              onClick={() => this.changeTab(0)}>Generate</span>
                        {` `}
                        <span className={tabActive(1)}
                              onClick={() => this.changeTab(1)}>Combine</span>
                        {` `}
                        <span className={tabActive(this.TABS.ADD_WORD)}
                              onClick={() => this.changeTab(this.TABS.ADD_WORD)}>Add</span>
                        {` `}
                        <span className={tabActive(this.TABS.LESSONS)}
                              onClick={() => this.changeTab(this.TABS.LESSONS)}>Lessons</span>
                        {` `}
                        <span className={tabActive(this.TABS.ADD_LESSON)}
                              onClick={() => this.changeTab(this.TABS.ADD_LESSON)}>Add Lesson</span>
                        {` `}
                        {showLessonEditor && <span className={tabActive(this.TABS.EDIT_LESSON)}
                              onClick={() => this.changeTab(this.TABS.EDIT_LESSON)}>Edit Lesson</span>}
                        {` `}
                        <span className={tabActive(this.TABS.SEARCH)}
                            onClick={() => this.changeTab(this.TABS.SEARCH)}>Search</span>
                        {` `}
                        <span className="save" onClick={this.save}>{saveText}</span>
                    </div>
                    {currentTab === 0 && this.renderMainGenerator()}
                    {currentTab === 1 &&
                        <RootCombiner
                            dict={dict}
                            onChangeDictionary={this.onChangeDictionary}
                        />
                    }
                    {currentTab === this.TABS.ADD_WORD && this.renderAdd()}
                    {currentTab === this.TABS.LESSONS &&
                        this.renderLessonBook()
                    }
                    {currentTab === this.TABS.ADD_LESSON &&
                        <LessonCreator
                            mode={LESSON_MODES.ADD}
                            lessonBook={lessonBook}
                            onChangeLessonBook={this.onChangeLessonBook}
                        />
                    }
                    {currentTab === this.TABS.EDIT_LESSON &&
                        <div>
                            <span className="warning">Warning: Switching tabs will cause changes to be lost</span>
                            <LessonCreator
                                lesson={lessonViewerLesson}
                                mode={LESSON_MODES.EDIT}
                                lessonBook={lessonBook}
                                onChangeLessonBook={this.onChangeLessonBook}
                            />
                            <button onClick={this.onCloseLessonEditor}>Close Editor</button>
                            <br/>
                        </div>
                    }
                    {currentTab === this.TABS.SEARCH && this.renderSearch()}
                    {showLoading && <div className="loading">Loading...</div> }
                    {showDictionary && this.renderDictionary(search === '' ? null : search)}
                    {canUndo &&
                        <div className="undo-delete-button"
                             onClick={this.onUndoDelete}
                        >Undo Delete</div>
                    }
                </div>
                {showLessonViewer &&
                    <LessonViewer
                        currentLesson={lessonViewerLesson}
                        lessons={lessonBook.getLessonsAs1DArray()}
                        onClose={this.onCloseLessonViewer}
                    />
                }
            </React.Fragment>
        );
    }
}

export default App;
