async function save(dictionary) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({words: dictionary.getWords()}),
    };

    const res = await fetch('http://localhost:6160/api/save', options);
    return await res.json();
}

async function saveLessons(lessonBook) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({lessons: lessonBook.getLessonsAs1DArray()})
    };

    const res = await fetch('http://localhost:6160/api/saveLessons', options);
    return await res.json();
}

async function deleteWords(words) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({words}),
    };

    const res = await fetch('http://localhost:6160/api/delete', options);
    return await res.json();
}

async function load() {
    const res = await fetch('http://localhost:6160/api/load');
    return await res.json();
}

async function loadLessons() {
    const res = await fetch('http://localhost:6160/api/loadLessons');
    return await res.json();
}

export { save, saveLessons, load, loadLessons, deleteWords }