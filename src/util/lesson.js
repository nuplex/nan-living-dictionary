import Generator from "./generator";

export default class Lesson {
    constructor(number, text, title) {
        this.clientCreatedAt = new Date();
        this.clientId = Lesson.generateId(number, text, title);
        this.createdAt = null;
        this.updatedAt = null;
        this.lessonGroup = 'DEFAULT';
        this.number = number;
        this.text = text;
        this.title = title;
    }

    static create({clientId, clientCreatedAt, createdAt, updatedAt, lessonGroup, number, text, title}) {
        let lesson = new Lesson(number, text, title);

        lesson.clientId = clientId;
        lesson.clientCreatedAt = clientCreatedAt;
        lesson.createdAt = createdAt;
        lesson.updatedAt = updatedAt;
        lesson.lessonGroup = lessonGroup;

        return lesson;
    }

    static generateId(number, text, title) {
        return (new Generator()).createWord(12, null, null, null) + Date.now() + text.length + title.length + number;
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

    getClientId() {
        return this.clientId;
    }

    getClientCreatedAt() {
        return this.clientCreatedAt;
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

    setClientCreatedAt(value) {
        this.clientCreatedAt = value;
    }

    setClientId(value) {
        this.clientId = value;
    }

    setCreatedAt(value) {
        this.createdAt = value;
    }

    setUpdatedAt(value) {
        this.updatedAt = value;
    }

    setLessonGroup(value) {
        this.lessonGroup = value;
    }
}
