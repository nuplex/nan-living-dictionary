import React from 'react';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';
import LessonBook from './util/lesson-book';
import './lesson-creator.scss';
import Lesson from "./util/lesson";
import LESSON_MODES from "./lesson-modes";

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
            mode: LESSON_MODES.ADD,
            number: 1,
            text: '',
            title: ''
        };

        this.canAdd = this.canAdd.bind(this);
        this.onAddLesson = this.onAddLesson.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeNumber = this.onChangeNumber.bind(this);
        this.onEditLesson = this.onEditLesson.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
    }

    componentDidMount() {
        const {lesson} = this.props;

        if (this.props.mode === LESSON_MODES.EDIT && this.props.lesson !== null) {
            this.setState({
                mode: LESSON_MODES.EDIT,
                number: lesson.getNumber(),
                text: lesson.getText(),
                title: lesson.getTitle()
            });
        }
    }

    canAdd() {
        let title = this.state.title;
        let hasTitle = title.trim() !== '';
        let hasText = this.state.text.trim() !== '';

        let lessonExists = this.props.lessonBook.getLessonByTitle(title) !== null;
        let numberExists = this.props.lessonBook.getLessonByNumber(this.state.number) !== null;

        return hasText && hasTitle && !lessonExists && !numberExists && this.state.mode !== LESSON_MODES.EDIT;
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

    onEditLesson() {
        let newLesson = new Lesson(this.state.number, this.state.text, this.state.title);
        let oldLesson = this.props.lesson;

        newLesson.setClientCreatedAt(oldLesson.getClientCreatedAt());
        newLesson.setClientId(oldLesson.getClientId());
        newLesson.setCreatedAt(oldLesson.getCreatedAt());
        newLesson.setLessonGroup(oldLesson.getLessonGroup());
        newLesson.setUpdatedAt(oldLesson.getCreatedAt());

        this.props.onChangeLessonBook(newLesson, LESSON_MODES.EDIT);
    }

    onTextChange(value) {
        this.setState({
            text: value
        });
    }

    render() {
        let {mode, number, text, title} = this.state;

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
                {mode === 'ADD' &&
                    <button
                        onClick={this.onAddLesson}
                        disabled={!this.canAdd()}
                    >
                        Add Lesson
                    </button>
                }
                {mode === 'EDIT' &&
                    <button
                        onClick={this.onEditLesson}
                    >
                        Submit Changes
                    </button>
                }
            </div>
        )
    }
}

LessonCreator.propTypes = {
    lesson: PropTypes.instanceOf(Lesson),
    lessonBook: PropTypes.instanceOf(LessonBook).isRequired,
    mode: PropTypes.string,
    onChangeLessonBook: PropTypes.func.isRequired
};

export default LessonCreator;
