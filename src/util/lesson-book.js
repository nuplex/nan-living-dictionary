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

    // This method is the most useful as this value cannot be changed and exists before upload
    getLessonByClientId(clientId) {
        let lesson;

        lesson = this.getLessonsAs1DArray().find(l => l.clientId === clientId);

        return lesson === undefined ? null : lesson;

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

    updateLesson(lesson) {
        let lessonExists = this.getLessonByClientId(lesson.getClientId()) !== null;

        if (lessonExists) {
            let index = this.lessons[lesson.getLessonGroup()].findIndex(l => l.getClientId() === lesson.getClientId());
            this.lessons[lesson.getLessonGroup()][index] = lesson; // note this is an overwrite, the clientId may be the same but other values may not
        } else {
            throw new Error('Lesson does not exist to update');
        }
    }
}
