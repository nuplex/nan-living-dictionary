const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema(
    {
        word: String,
        english: String,
        type: String
    },
    {
        collection: 'dictionary'
    }
);

const Word = mongoose.model('Word', wordSchema);

const save = (req, res) => {
    const words = req.body.words;

    res.set({'Access-Control-Allow-Origin': '*'});

    mongoose.connect('mongodb://localhost:27017/nld', {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        if(words.length <= 0){
            mongoose.disconnect();
            res.status(400);
            res.json({msg: 'Nothing to save.'});
            return;
        }

        let i = 0;

        const callback = (success) => {
            if (success) {
                i = i + 1;

                if(i >= words.length){
                    mongoose.disconnect();
                    res.status(200);
                    res.json({msg: 'success'});
                } else {
                    saveWord(words[i], callback);
                }
            } else {
                mongoose.disconnect();
                res.status(500);
                res.json({msg: 'failed: '+error});
            }
        };

        saveWord(words[i], callback)
    });
};

const load = (req, res) => {
    res.set({'Access-Control-Allow-Origin': '*'});

    mongoose.connect('mongodb://localhost:27017/nld', {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.once('open', () => {
        Word.find((err, words) => {
            mongoose.disconnect();

            if (err) {
                res.status(400);
                res.json({msg: 'failed: ' + error});
            } else {
                res.json({dictionary: words.map(w => ({word: w.word, english: w.english, type: w.type}))});
            }
        });
    })
};

const deleteAll = (req, res) => {
    const words = req.body.words;

    res.set({'Access-Control-Allow-Origin': '*'});

    mongoose.connect('mongodb://localhost:27017/nld', {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.once('open', () => {
        if(words.length <= 0){
            mongoose.disconnect();
            res.status(400);
            res.json({msg: 'nothing to delete:'});
            return;
        }

        let i = 0;

        const callback = (success) => {
            if (success) {
                i = i + 1;

                if(i >= words.length){
                    mongoose.disconnect();
                    res.status(200);
                    res.json({msg: 'success'});
                } else {
                    deleteWord(words[i], callback);
                }
            } else {
                mongoose.disconnect();
                res.status(500);
                res.json({msg: 'failed: '+error});
            }
        };

        deleteWord(words[i], callback)
    })
};

function saveWord(word, callback){
    Word.findOneAndUpdate({word: word.word}, {...word}, {upsert: true, useFindAndModify: false}, (err) => {
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    });
}

function deleteWord(word, callback){
    Word.findOneAndDelete({word: word.word}, {useFindAndModify: false}, (err) => {
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    })
}

function toMongoWord(word) {
    return new Word({
        word: word.word,
        english: word.english,
        type: word.type
    });
}

module.exports = { save, load, deleteAll };