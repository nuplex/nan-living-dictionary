import React from 'react';
import PropTypes from 'prop-types';
import Generator from './util/generator.js';
import './root-combiner.scss';
import Dictionary from "./util/dictionary";
import WORD_TYPES from "./word-types";

class RootCombiner extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            currentRoots: [],
            roots: [],
            wildSyllables: 2,
            english: '???',
            wordExists: false,
            maxedOutOnGenerating: false,
            typeOptions: [
                {name: '', value: null},
                {name: 'Noun', value: WORD_TYPES.NOUN},
                {name: 'Modifier', value: WORD_TYPES.MODIFIER},
                {name: 'Verb', value: WORD_TYPES.VERB},
                {name: 'Root', value: WORD_TYPES.ROOT}
            ],
            wordType: null
        };

        this.add = this.add.bind(this);
        this.addRoot = this.addRoot.bind(this);
        this.removeRoot = this.removeRoot.bind(this);
        this.onChangeWildSyllables = this.onChangeWildSyllables.bind(this);
        this.onChangeEnglish = this.onChangeEnglish.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
    }

    componentDidMount(){
        this.setState({
            roots: [...this.props.dict.getRoots(), {word: 'WILD', english: '???', type: 'WILD'}]
        });
    }

    add(){
        let gen = new Generator();
        let word = gen.createWordFromRoots(this.state.currentRoots, this.state.wildSyllables, this.state.english, null, this.props.dict.getOnlyWords());
        const failure = (on) => {
            setTimeout(() => {
                this.setState({
                    [on]: false
                })
            }, 3000)
        };

        if(word === null){
            this.setState({
                currentRoots: [],
                english: '???',
                wordExists: true
            }, () => failure('wordExists'));

            return;
        }

        if(word === '_MAXED_OUT_'){
            this.setState({
                maxedOutOnGenerating: true
            }, () => failure('maxedOutOnGenerating'));

            return;
        }

        this.props.onChangeDictionary(word, this.state.english, null, this.state.wordType);
    }

    addRoot(root){
        this.setState({
            currentRoots: [...this.state.currentRoots, root]
        })
    }

    removeRoot(root){
        let newRoots = this.state.currentRoots.filter(r => r.word !== root.word);
        this.setState({
            currentRoots: newRoots
        })
    }

    onChangeWildSyllables(event) {
        this.setState({
            wildSyllables: parseInt(event.target.value)
        });
    }

    onChangeEnglish(event) {
        this.setState({
            english: event.target.value
        });
    }

    onChangeType(event) {
        this.setState({
            wordType: event.target.value
        })
    }

    render(){
        const {currentRoots, english, maxedOutOnGenerating, roots, typeOptions, wildSyllables, wordExists} = this.state;

        return (
            <div className="root-combiner-cont">
                <div className="top">
                    <div className="combine-area">
                        {currentRoots.map((root, i) => {
                            return (
                                <div className="root"
                                     key={i+root.word}
                                     onClick={() => this.removeRoot(root)}
                                >{`${root.word} (${root.english})`}</div>
                            )
                        })}
                    </div>
                    <label htmlFor="syllables">
                        <input name="syllables"
                               type="number"
                               onChange={this.onChangeWildSyllables}
                               value={wildSyllables}
                        />
                    </label>
                    <label htmlFor="english">
                        <input name="english"
                               type="text"
                               onChange={this.onChangeEnglish}
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
                    <button onClick={this.add}
                            disabled={currentRoots.length < 2}
                    >Create Word</button>
                    {wordExists && <span>This word exists already.</span>}
                    {maxedOutOnGenerating && <span>Generation failed. There may be too many similar words.</span>}
                </div>
                <div className="roots-area">
                    {roots.map((root, i) => {
                        if(currentRoots.filter(r => r.word === root.word).length !== 0 && root.word !== 'WILD'){
                            return null;
                        }

                        return (
                            <div className="root"
                                 key={i+root.word}
                                 onClick={() => this.addRoot(root)}
                            >{`${root.word} (${root.english})`}</div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

RootCombiner.propTypes = {
    dict: PropTypes.instanceOf(Dictionary).isRequired,
    onChangeDictionary: PropTypes.func.isRequired,
};

export default RootCombiner;