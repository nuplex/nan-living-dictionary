import React from 'react';
import PropTypes from 'prop-types';
import Generator from './util/generator.js';
import './root-combiner.css';
import Dictionary from "./util/dictionary";

class RootCombiner extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            currentRoots: [],
            roots: [],
            wildSyllables: 2,
            english: '???'
        };

        this.add = this.add.bind(this);
        this.addRoot = this.addRoot.bind(this);
        this.removeRoot = this.removeRoot.bind(this);
        this.onChangeWildSyllables = this.onChangeWildSyllables.bind(this);
        this.onChangeEnglish = this.onChangeEnglish.bind(this);
    }

    componentDidMount(){
        this.setState({
            roots: [...this.props.dict.getRoots(), {word: 'WILD', english: '???', type: 'WILD'}]
        });
    }

    add(){
        let gen = new Generator();
        let word = gen.createWordFromRoots(this.state.currentRoots, this.state.wildSyllables, this.state.english, null, this.props.dict);

        this.props.onChangeDictionary(word, this.state.english, null);
    }

    addRoot(root){
        this.setState({
            currentRoots: [root, ...this.state.currentRoots]
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

    render(){
        const {currentRoots, roots, wildSyllables, english} = this.state;

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
                    <button onClick={this.add}
                            disabled={currentRoots.length < 2}
                    >Create Word</button>
                </div>
                <div className="roots-area">
                    {roots.map((root, i) => {
                        if(currentRoots.indexOf(root.word) !== -1 && root.word !== 'WILD'){
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