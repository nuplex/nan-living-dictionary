import React from 'react';
import PropTypes from 'prop-types';
import Dictionary from "./util/dictionary";
import WORD_TYPES from "./word-types";
import './word-creator.scss';

class WordCreator extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            english: '',
            nan: '',
            roots: [],
            rootSearch: '',
            rootsUsed: [],
            typeOptions: [
                {name: '', value: undefined},
                {name: 'Adjective', value: WORD_TYPES.ADJECTIVE},
                {name: 'Verb', value: WORD_TYPES.VERB},
                {name: 'Root', value: WORD_TYPES.ROOT}
            ],
            wordCache: [],
            wordExists: false,
            wordType: null
        };

        this.add = this.add.bind(this);
        this.onAddRoot = this.onAddRoot.bind(this);
        this.onChangeEnglish = this.onChangeEnglish.bind(this);
        this.onChangeNan = this.onChangeNan.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onRemoveRoot = this.onRemoveRoot.bind(this);
        this.onRootSearch = this.onRootSearch.bind(this);
    }

    componentDidMount(){
        this.setState({
            roots: [...this.props.dictionary.getRoots()]
        });
    }

    add() {
        let word = {
            english: this.state.english,
            nan: this.state.nan,
            type: this.state.wordType
        };

        this.setState({
            english: '',
            nan: '',
            wordType: null,
            wordCache: [...this.state.wordCache, word]
        });

        this.props.onChangeDictionary(word.nan, word.english, word.type);
    }

    onAddRoot(root){
        this.setState({
            rootsUsed: [...this.state.rootsUsed, root]
        });
    }

    onChangeEnglish(event) {
        this.setState({
            english: event.target.value
        });
    }

    onChangeNan(event) {
        let nan = event.target.value;

        this.setState({
            nan: event.target.value,
        });

        if (this.props.dictionary.findWord(nan)) {
            this.setState({
                wordExists: true
            });
        } else {
            this.setState({
                wordExists: false
            });
        }
    }

    onChangeType(event) {
        this.setState({
            wordType: event.target.value
        })
    }

    onRemoveRoot(root) {
        let rootsUsed = this.state.rootsUsed.filter((r) => r.word !== root.word);

        this.setState({
            rootsUsed: rootsUsed
        })
    }

    onRootSearch(event) {
        this.setState({
            rootSearch: event.target.value
        });
    }

    renderRootSearchResults() {
        let roots = this.state.roots;
        let rootSearch = this.state.rootSearch;
        let rootsUsed = this.state.rootsUsed;

        return (
            <div className="dict-cont">
                {roots.map((entry, i) => {
                    let inRootsUsed = rootsUsed.some(root => root.word === entry.word);

                    if (rootSearch !== '' && !inRootsUsed && (entry.word.includes(rootSearch) || entry.english.includes(rootSearch))) {
                        return (
                            <div className="entry" key={i + entry.word}>
                                <span className="nan-entry__root">{entry.word}</span>
                                <span>{' '}</span>
                                <span className="english-entry">{entry.english}</span>
                                <div className="root-badge">root</div>
                                <button onClick={() => this.onAddRoot(entry)}>Add</button>
                            </div>
                        )
                    }

                    return null;
                })}
            </div>
        );
    }

    render(){
        const {english, nan, rootSearch, rootsUsed, typeOptions, wordCache, wordExists} = this.state;
        let showJustAdded = wordCache.length > 0;
        let showRootsUsed = rootsUsed.length > 0;

        return (
          <div className="word-creator-cont">
              <section className="word-creator-cont__top">
                  <label htmlFor="english">
                      <input name="english"
                             type="text"
                             onChange={this.onChangeNan}
                             placeholder="Nan"
                             value={nan}
                      />
                  </label>
                  <label htmlFor="syllables">
                      <input name="syllables"
                             type="text"
                             onChange={this.onChangeEnglish}
                             placeholder="English"
                             value={english}
                      />
                  </label>
                  <label htmlFor="type">
                      <select
                          name="type"
                          onChange={this.onChangeType}
                      >
                          {typeOptions.map((type, i) => {
                              return (
                                  <option key={type.value + i}
                                          value={type.value}
                                  >
                                      {type.name}
                                  </option>
                              )
                          })}
                      </select>
                  </label>
                  <button
                      onClick={this.add}
                      disabled={wordExists}
                  >
                      Add Word
                  </button>
                  {wordExists && <span>This word exists already.</span>}
              </section>
              {showRootsUsed &&
                  <section>
                      <h3 className="word-creator__roots-used-title">Roots used</h3>
                      {rootsUsed.map((root, i) => {
                          return (
                              <div className="entry" key={i + root.word}>
                                  <span className="nan-entry__root">{root.word}</span>
                                  <span>{' '}</span>
                                  <span className="english-entry">{root.english}</span>
                                  <div className="root-badge">root</div>
                                  <button onClick={() => this.onRemoveRoot(root)}>Remove</button>
                              </div>
                          );
                      })}
                  </section>
              }
              <section className="word-creator__root-search-cont">
                  <div className="word-creator__root-search">
                      <label htmlFor="root-search">
                          Search for roots used:
                          <input name="root-search"
                                 type="text"
                                 onChange={this.onRootSearch}
                                 value={rootSearch}
                          />
                      </label>
                  </div>
                  {this.renderRootSearchResults()}
              </section>
              {showJustAdded &&
                  <section>
                      <h3 className="word-creator__just-added-title">Just added</h3>
                      {wordCache.map((word, i) => {
                          let isRoot = word.type === WORD_TYPES.ROOT;
                          let nanEntryClass = !isRoot ? 'nan-entry' : 'nan-entry__root';

                          return (
                              <div className="entry" key={i + word.nan}>
                                  <span className={nanEntryClass}>{word.nan}</span>
                                  <span>{' '}</span>
                                  <span className="english-entry">{word.english}</span>
                                  {isRoot && <div className="root-badge">root</div>}
                              </div>
                          )
                      })}
                  </section>
              }
          </div>
        );
    }

}

WordCreator.propTypes = {
    dictionary: PropTypes.instanceOf(Dictionary).isRequired,
    onChangeDictionary: PropTypes.func.isRequired,
};

export default WordCreator;
