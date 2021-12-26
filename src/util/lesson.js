export default class Lesson {
    constructor(number, text, title) {
        this.clientCreatedAt = new Date();
        this.createdAt = null;
        this.updatedAt = null;
        this.lessonGroup = 'DEFAULT';
        this.number = number;
        this.text = text;
        this.title = title;
    }

    static create({clientCreatedAt, createdAt, updatedAt, lessonGroup, number, text, title}) {
        let lesson = new Lesson(number, text, title);

        lesson.clientCreatedAt = clientCreatedAt;
        lesson.createdAt = createdAt;
        lesson.updatedAt = updatedAt;
        lesson.lessonGroup = lessonGroup;

        return lesson;
    }

    changeNumber(number) {
        this.number = number;
    }

    changeText(text) {
        this.text = text;
    }

    changeTitle(title) {
        this.title = title;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getLessonGroup() {
        return this.lessonGroup;
    }

    getNumber() {
        return this.number;
    }

    getText() {
        return this.text;
    }

    getTitle() {
        return this.title;
    }

    getUpdatedAt() {
        return this.updatedAt;
    }

    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    setId(id) {
        this.id = id;
    }

    setLessonGroup(lessonGroup) {
        this.lessonGroup = lessonGroup;
    }

    setUpdatedAt(updatedAt) {
        this.updatedAt = updatedAt;
    }
}
