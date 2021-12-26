import React from 'react';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';
import LessonBook from './util/lesson-book';
import './lesson-creator.scss';
import Lesson from "./util/lesson";

class LessonCreator extends React.Component {
    constructor(props){
        super(props);

        this.modules = {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline','strike', 'blockquote'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'align': [] }, {'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image'],
                ['clean']
            ],
        };

        this.state = {
            number: 1,
            text: '',
            title: ''
        };

        this.canAdd = this.canAdd.bind(this);
        this.onAddLesson = this.onAddLesson.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeNumber = this.onChangeNumber.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }

    canAdd() {
        let title = this.state.title;
        let hasTitle = title.trim() !== '';
        let hasText = this.state.text.trim() !== '';

        let lessonExists = this.props.lessonBook.getLessonByTitle(title) !== null;
        let numberExists = this.props.lessonBook.getLessonByNumber(this.state.number) !== null;

        return hasText && hasTitle && !lessonExists && !numberExists;
    }

    onAddLesson() {
        this.props.onChangeLessonBook(new Lesson(this.state.number, this.state.text, this.state.title));

        this.setState({
            text: '',
            title: ''
        });
    }

    onChangeNumber(event) {
        this.setState({
            number: event.target.value
        });
    }

    onChangeTitle(event) {
        this.setState({
            title: event.target.value
        });
    }

    onTextChange(value) {
        this.setState({
            text: value
        });
    }

    render() {
        let {number, text, title} = this.state;

        return (
            <div>
                <section>
                    <label htmlFor="title">
                        <input
                            className="lesson-creator__title__input"
                            name="title"
                            type="text"
                            onChange={this.onChangeTitle}
                            placeholder="Lesson Title"
                            value={title}
                        />
                    </label>
                    <label htmlFor="number">
                        <input
                            className="lesson-creator__number__input"
                            name="number"
                            type="number"
                            step={0.01}
                            onChange={this.onChangeNumber}
                            placeholder="#"
                            value={number}
                        />
                    </label>
                </section>
                <div className="lesson-creator__editor">
                    <ReactQuill
                        modules={this.modules}
                        onChange={this.onTextChange}
                        theme={"snow"}
                        value={text}
                    />
                </div>
                <button
                    onClick={this.onAddLesson}
                    disabled={!this.canAdd()}
                >
                    Add Lesson
                </button>
            </div>
        )
    }
}

LessonCreator.propTypes = {
    lessonBook: PropTypes.instanceOf(LessonBook).isRequired,
    onChangeLessonBook: PropTypes.func.isRequired
};

export default LessonCreator;
