import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import Lesson from "./util/lesson";
import './lesson-viewer.scss';

class LessonViewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            atMaximumLesson: false,
            atMinimumLesson: false,
            currentLessonIndex: -1,
            lesson: this.props.currentLesson
        };

        this.onChangeLesson = this.onChangeLesson.bind(this);
    }

    componentDidMount() {
        let length = this.props.lessons.length;
        let currentLessonIndex = this.props.lessons.findIndex(lesson => lesson.getTitle() === this.state.lesson.getTitle());
        let max = false;
        let min = false;

        if (length > 1) {
            if (currentLessonIndex === length - 1) {
                max = true
            }

            if (currentLessonIndex === 0) {
                min = true;
            }
        }

        this.setState({
            atMaximumLesson: max,
            atMinimumLesson: min,
            currentLessonIndex: currentLessonIndex
        });
    }

    onChangeLesson(increment) {
        let newIndex = this.state.currentLessonIndex + increment;

        if (newIndex <= 0 && !this.state.atMinimumLesson) {
            newIndex = 0;

            this.setState({
                atMinimumLesson: true,
                atMaximumLesson: false,
                currentLessonIndex: newIndex
            });
        } else if (newIndex >= this.props.lessons.length - 1 && !this.state.atMaximumLesson) {
            newIndex = this.props.lessons.length - 1;

            this.setState({
                atMaximumLesson: true,
                atMinimumLesson: false,
                currentLessonIndex: newIndex
            });
        }

        this.setState({
            currentLessonIndex: newIndex,
            lesson: this.props.lessons[newIndex]
        });
    }

    render() {
        let {atMaximumLesson, atMinimumLesson, lesson} = this.state;

        return (
            <div className="lesson-viewer-cont">
                <div className="lesson-viewer">
                    <h1>{lesson.getTitle()}</h1>
                    <div className="lesson-viewer__body">
                        <ReactQuill
                            readOnly={true}
                            theme="bubble"
                            value={lesson.getText()}
                        />
                    </div>
                    <div className="lesson-viewer__controls">
                        <button
                            onClick={() => this.onChangeLesson(-1)}
                            disabled={atMinimumLesson}
                        >
                            Previous
                        </button>
                        <button
                            onClick={this.props.onClose}
                        >
                            Close
                        </button>
                        <button
                            onClick={() => this.onChangeLesson(1)}
                            disabled={atMaximumLesson}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        )
    };
}

LessonViewer.propTypes = {
    currentLesson: PropTypes.instanceOf(Lesson).isRequired,
    lessons: PropTypes.array,
    onClose: PropTypes.func.isRequired
};

export default LessonViewer;
