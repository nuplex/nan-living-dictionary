import React from 'react';
import PropTypes from 'prop-types';
import Generator from './util/generator.js';
import './App.css';
import Dictionary from "./util/dictionary";

class RootGenerator extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            syllables: 2,
            english: '???'
        };

        this.add = this.add.bind(this);
        this.onChangeSyllables = this.onChangeSyllables.bind(this);
        this.onChangeEnglish = this.onChangeEnglish.bind(this);
    }

    add(){
        let gen = new Generator();
        let word = gen.createWord(this.state.syllables, this.state.english, 'ROOT');

        this.props.onChangeDictionary(word, this.state.english, 'ROOT');

    }

    onChangeSyllables(event) {
        this.setState({
            syllables: parseInt(event.target.value)
        });
    }

    onChangeEnglish(event) {
        this.setState({
            english: event.target.value
        });
    }

    render() {
        const {syllables, english} = this.state;

        return (
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
                    <button onClick={this.add}>Add Root</button>
                </div>
        );
    }
}

RootGenerator.propTypes = {
    dict: PropTypes.instanceOf(Dictionary).isRequired,
    onChangeDictionary: PropTypes.func.isRequired,
};

export default RootGenerator;
