async function save(dictionary) {
    const headers = {
        'Content-Type': 'application/json',
    };

    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({words: dictionary.getWords()}),
    };

    const res = await fetch('http://localhost:6160/api/save', options);
    return await res.json();
}

async function load() {
    const res = await fetch('http://localhost:6160/api/load');
    return await res.json();
}

export { save, load }