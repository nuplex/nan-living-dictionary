import Lesson from "./lesson";

export default class LessonBook {
    constructor(copyFrom) {
        if (Array.isArray(copyFrom)) {
            this.lessons = LessonBook.convertLessonsToLessonBook(copyFrom);
        } else {
            this.lessons = copyFrom instanceof LessonBook ? copyFrom.getLessons() : {};
        }
    }

    static convertLessonsToLessonBook(lessons) {
        let lessonBook = new LessonBook();

        lessons.forEach(lesson => {
            let realLesson = Lesson.create(lesson);
            let lessonGroup = realLesson.getLessonGroup();
            if (lessonBook.lessons[lessonGroup] !== undefined) {
                lessonBook.lessons[lessonGroup].push(realLesson);
            } else {
                lessonBook.lessons[lessonGroup] = [realLesson];
            }
        });

        return lessonBook.getLessons();
    };

    addLesson(lesson) {
        let group = lesson.getLessonGroup();
        let groupExists = this.lessons[group] !== undefined;

        if (groupExists) {
            this.lessons[group].push(lesson);
        } else {
            this.lessons[group] = [lesson];
        }
    }

    getLessonByNumber(number) {
        let lesson;

        lesson = this.getLessonsAs1DArray().find(lesson => lesson.number === number);

        return lesson === undefined ? null : lesson;
    }

    getLessonByTitle(title) {
        let lesson;

        lesson = this.getLessonsAs1DArray().find(lesson => lesson.title === title);

        return lesson === undefined ? null : lesson;
    }

    getLessons() {
        return this.lessons;
    }

    getLessonsAs1DArray() {
        let lessons = [];
        let groups = Object.keys(this.lessons);

        groups.forEach((group) => {
           lessons = [...lessons, ...this.lessons[group]];
        });

        return lessons;
    }
}
