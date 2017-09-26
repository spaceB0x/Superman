const log = console.log,
    low = require('lowdb'),
    _ = require('lodash'),
    clear = require('clear'),
    columnify = require('columnify'),
    inquirer = require('inquirer'),
    chalk = require('chalk'),
    red = chalk.red,
    green = chalk.green,
    yellow = chalk.yellow,
    fs = require('fs')
dbpath = __dirname + '/../db.json'

var db = JSON.parse(fs.readFileSync(__dirname + '/../db.json', 'utf8'))

module.exports = {

    addModule: (n) => {
        db["modules"].push({
            name: n,
            questions: [],
            commands: [],
            tags: [],
            platform: ""
        })
        module.exports.writeDB()
    },

    removeModule: (name) => {
        _.remove(db['modules'], (n) => {
            return _.includes(n, name);
        })
        module.exports.writeDB()
    },

    writeDB: () => {
        fs.writeFileSync(dbpath, JSON.stringify(db))
    },

    checkModuleExists: (name) => {
        let arr = db['modules'];
        for (let obj in arr) {
            if (_.includes(arr[obj], name)) {
                return true
            }
        }
    },
    //takes parameters "command", "question", or "tag"
    appendModuleItem: (type, cb) => {
        let arr = db['modules'];
        let other;
        let obj_str;
        if (type == "command") {
            other = "comment";
            obj_str = `{ "${type}": "", "${other}": ""}`;
        } else if (type == "question") {
            other = "answer"
            obj_str = `{ "${type}": "", "${other}": ""}`;
            //obj_str = `{ "name": "${other}", "type": "input", "message": "" , "answer": "", "validate": function (value) {if(value.length){return true;} else {return "Please enter an answer.";}}}`;
        } else {
            other = "none";
            obj_str = `{ "${type}": "", "${other}": ""}`;
        }


        getModuleItemParams(type, other, (arguments) => {
            log("here")
            for (let obj in arr) {
                if (_.includes(arr[obj], global.loaded_module)) {
                    let item = JSON.parse(obj_str);
                    switch (type) {
                        case 'command':
                            item.command = arguments.command;
                            item.comment = arguments.comment;
                            arr[obj].commands.push(item);
                            break;
                        case 'question':
                            item.question = arguments.question;
                            item.answer = arguments.answer;
                            arr[obj].questions.push(item);
                            break;
                        case 'tag':
                            item.tag = arguments.tag;
                            item.none = arguments.none;
                            arr[obj].tags.push(item);
                            break;
                        default:
                            break;
                    }
                    module.exports.writeDB();
                    return cb();
                }
            }
            return cb();
        })

    },

    listModuleCommands: (cb) => {
        log(chalk.cyan(`-----------------------------------------\nCommands for module: ${global.loaded_module}\n-----------------------------------------`))
        let arr = db['modules'];
        for (let obj in arr) {
            if (_.includes(arr[obj], global.loaded_module)) {
                let columns = columnify(arr[obj].commands);
                console.log(columns)
            }
        }
        return cb();
    },

    removeModuleItem: (type) => {
        let arr = db['modules'];
        for (let obj in arr) {
            if (_.includes(arr[obj], global.loaded_module)) {
                switch (type) {
                    case 'command':
                        _.remove(db['modules'].commands[obj], (n) => {
                            return _.includes(n, name);
                        })
                        break;
                    case 'question':
                        _.remove(db['modules'].questions[obj], (n) => {
                            return _.includes(n, name);
                        })
                        break;
                    case 'tag':
                        _.remove(db['modules'].tags[obj], (n) => {
                            return _.includes(n, name);
                        })
                        break;
                    default:
                        break;
                }
                module.exports.writeDB();
            }
        }
    },

    quiz: (cb) => {
        let arr = db['modules'];
        for (let obj in arr) {
            if (_.includes(arr[obj], global.loaded_module)) {
                let size = arr[obj].questions.length;
                //for (let q in arr[obj].questions) {
                questionAllPrompt(arr[obj].questions, (arguments) => {
                    return cb();
                });
                //}
            }
        }
    },

    drill: (num, cb) => {
        let arr = db['modules'];
        for (let obj in arr) {
            if (_.includes(arr[obj], global.loaded_module)) {
                let size = arr[obj].questions.length;
                drillAllPrompt(arr[obj].questions, num, (arguments) => {
                    return cb();
                });
            }
        }
    },

    //Completely random questions from the number provided
    random_quiz: (num, cb) => {
        let arr = db['modules'];
        let q = [];
        let q_arr = [];
        let proms = [];

        for (let x = 0; x < arr.length; x++) {
            q = q.concat(arr[x].questions);
        }

        for (let s = 0; s < num; s++) {
            let r1 = _.random(q.length - 1);
            log(r1)
            proms.push(new Promise((resolve, reject) => {
                q_arr.push(q[r1]);
                resolve();
            }).catch(err => {
                log(err);
            }))
        }

        Promise.all(proms)
            .then(c => {
                questionAllPrompt(q_arr, (arguments) => {
                    return cb();
                })
            }).catch(err => {
                log(err);
            })


    },

    changeModuleCommandAnswer: () => {},

    changeModuleCommandQuestion: () => {},

    editModuleCheatSheet: () => {},

    listModules: () => {
        log("-------\nMODULES\n-------");
        _.forEach(db['modules'], (obj) => {
            log(chalk.cyan(obj.name))
        })
    },

    listQA: () => {},

    tagModule: () => {},

    tagModuleCommand: () => {},

    iterateDB: (func) => {
        let arr = db['modules'];
        for (let obj in arr) {}
    }
}

/*
Helper functions
*/

function getModuleItemParams(type, other, callback) {
    var questions = [{
            name: `${type}`,
            type: 'input',
            message: `Enter a ${type} for this module`,
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return `Please enter a ${type}`;
                }
            }
        },
        {
            name: `${other}`,
            type: 'input',
            message: `Enter a ${other} for the ${type}:`,
            validate: function (value) {
                return true;
            }
        }
    ];

    inquirer.prompt(questions).then(callback);
}

function questionAllPrompt(q_arr, cb) {
    let new_arr = [];
    for (let x in q_arr) {
        let o = {
            name: 'answer',
            type: 'input',
            message: `${q_arr[x].question}`,
            validate: function (value) {
                if (value.length) {
                    if (value == q_arr[x].answer) {
                        clear()
                        log(green("\tCorrect!"))

                        return true
                    } else {
                        log(red(`\tWrong!`))
                        log(yellow(`Answer is: ${q_arr[x].answer}`));
                        return true;
                    }
                } else {
                    return `Please enter an answer.`;
                }
            }
        }
        new_arr.push(o);
    }

    inquirer.prompt(new_arr).then(cb);
}

function drillAllPrompt(q_arr, num, cb) {
    let new_arr = [];
    for (let x in q_arr) {
        let o = {
            name: 'answer',
            type: 'input',
            message: `${q_arr[x].question}`,
            validate: function (value) {
                if (value.length) {
                    if (value == q_arr[x].answer) {
                        log(green("Correct!"));
                        return true;
                    } else {
                        log(red("False"));
                        log(yellow(`The answer is: ${q_arr[x].answer}`))
                        return true;
                    }
                } else {
                    return `Please enter an answer.`;
                }
            }
        }
        for (let x = 0; x < num; x++) {
            new_arr.push(o);
        }
    }
    log(new_arr)
    inquirer.prompt(new_arr).then(cb);
}


//function appendObject()