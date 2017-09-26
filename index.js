const log = console.log,
    readline = require('readline'),
    clear = require('clear'),
    chalk = require('chalk'),
    red = chalk.red,
    green = chalk.green,
    yellow = chalk.yellow,
    modules = require(__dirname + '/src/modules')

global.loaded_module = "";

function mainPrompt() {
    let add_prompt;
    if (loaded_module != "") {
        add_prompt = ` [${chalk.red(global.loaded_module)}]`;
    } else {
        add_prompt = '';
    }

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `SUPERMAN${add_prompt} >`
    });

    rl.prompt();
    rl.on('line', (line) => {
        linearr = line.trim().split(" ");
        switch (linearr[0].trim()) {
            case 'load':
                if (linearr[1]) {
                    if (modules.checkModuleExists(linearr[1])) {
                        rl.close()
                        global.loaded_module = `${linearr[1]}`
                        mainPrompt()
                    } else {
                        log(yellow(`The module ${linearr[1]} does not exist`))
                        rl.prompt()
                    }
                }
                break;
            case 'unload':
                rl.close();
                global.loaded_module = ""
                mainPrompt();
                break;
            case 'test':
                rl.prompt();
                break;
            case 'cheat':
                rl.prompt();
                break;
            case 'quiz':
                rl.close();
                if (global.loaded_module != "") {
                    modules.quiz(() => {
                        mainPrompt();
                    });
                } else {
                    log(red("Please load a module to quiz against."));
                    mainPrompt();
                }
                break;
            case 'random':
                rl.close();
                if (linearr[1]) {
                    modules.random_quiz(linearr[1], () => {
                        mainPrompt();
                    });
                } else {
                    log(yellow("Please list a number of random questions you want"))
                    mainPrompt();
                }
                break;
            case 'drill':
                rl.close();
                if (global.loaded_module != "") {
                    if (linearr[1]) {
                        modules.drill(linearr[1], () => {
                            mainPrompt();
                        });
                    } else {
                        log(yellow("Please list a number of times to iterate in the drill"))
                        mainPrompt();
                    }
                } else {
                    log(red("Please load a module to drill against."));
                    mainPrompt();
                }
                break;
            case 'add':
                rl.close();
                if (linearr.length > 1) {
                    switch (linearr[1].trim()) {
                        case 'module':
                            if (linearr[2]) {
                                modules.addModule(linearr[2])
                            }
                            mainPrompt();
                            break;
                        case 'command':
                            if (global.loaded_module != "") {
                                modules.appendModuleItem("command", () => {
                                    mainPrompt();
                                });
                            } else {
                                log(yellow("You must have a module loaded to add a command to."))
                                mainPrompt();
                            }
                            break;
                        case 'c':
                            if (global.loaded_module != "") {
                                modules.appendModuleItem("command", () => {
                                    mainPrompt();
                                });
                            } else {
                                log(yellow("You must have a module loaded to add a command to."))
                                mainPrompt();
                            }
                            break;
                        case 'question':
                            if (global.loaded_module != "") {
                                modules.appendModuleItem("question", () => {
                                    mainPrompt();
                                });
                            } else {
                                log(yellow("You must have a module loaded to add a question to."))
                                mainPrompt();
                            }
                            break;
                        case 'q':
                            if (global.loaded_module != "") {
                                modules.appendModuleItem("question", () => {
                                    mainPrompt();
                                });
                            } else {
                                log(yellow("You must have a module loaded to add a question to."))
                                mainPrompt();
                            }
                            break;
                        case 'tag':
                            if (global.loaded_module != "") {
                                modules.appendModuleItem("tag", () => {
                                    mainPrompt();
                                })
                            } else {
                                log(yellow("You must have module loaded to add a tag to"));
                                mainPrompt();
                            }
                            break;
                        case 't':
                            if (global.loaded_module != "") {
                                modules.appendModuleItem("tag", () => {
                                    mainPrompt();
                                })
                            } else {
                                log(yellow("You must have module loaded to add a tag to"));
                                mainPrompt();
                            }
                            break;
                        default:
                            mainPrompt();
                            break;
                    }
                } else {
                    log(yellow("You need something to add (command, module, etc.)"))
                    mainPrompt();
                }
                break;
            case 'remove':
                rl.close();
                if (linearr.length > 2) {
                    switch (linearr[1].trim()) {
                        case 'module':
                            modules.removeModule(linearr[2])
                            mainPrompt();
                            break;
                        case 'command':
                            if (global.loaded_module != "") {
                                modules.removeModuleItem("command")
                                mainPrompt();
                            } else {
                                log(yellow("You must have a module loaded to remove a command from"))
                            }
                            break;
                        case 'question':
                            if (global.loaded_module != "") {
                                modules.removeModuleItem("question")
                                mainPrompt();
                            } else {
                                log(yellow("You must have a module loaded to remove a question from"))
                            }
                            break;
                        case 'tag':
                            if (global.loaded_module != "") {
                                modules.removeModuleItem("tag")
                                mainPrompt();
                            } else {
                                log(yellow("You must have a module loaded to remove a tag from"))
                            }
                            break;
                        default:
                            log(yellow('Need to specify something to remove'));
                            mainPrompt();
                            break;
                    }
                } else {
                    log(yellow("Please specify something to remove"))
                    mainPrompt();
                }
                break;
            case 'list':
                if (linearr.length > 1) {
                    clear();
                    switch (linearr[1].trim()) {
                        case 'modules':
                            modules.listModules();
                            rl.prompt();
                            break;
                        case 'commands':
                            if (global.loaded_module != "") {
                                modules.listModuleCommands(() => {
                                    rl.prompt();
                                });
                            } else {
                                log(yellow(`${linearr[2]} is not a known parameter for list`))
                                rl.prompt();
                            }
                            break;
                        default:
                            log(yellow("Can't list that"))
                            rl.prompt();
                            break;
                    }
                } else {
                    log(yellow("You need to state what you want to list (commands or modules)"))
                    rl.prompt();
                }
                break;
            case 'clear':
                clear();
                rl.prompt();
                break;
            case 'exit':
                log(green("Exiting."));
                rl.close();
                break;
            default:
                log(yellow("This command is not a known command"));
                rl.prompt();
                break;

        }
    })
}

mainPrompt();