var fs = require('fs');
var mkdirp = require('mkdirp');
var program = require('commander');
var bundler = require('../bundler');
var watcher = require('../watcher');

program
    .version(JSON.parse(fs.readFileSync(__dirname + '/../../package.json', 'utf8')).version);

program
    .command('install')
    .description('Install a package locally')
    .action(function() {
        mkdirp(process.cwd() + '/bermooda_modules', function (err) {
            if (err) {
                console.error(err);
            }
        });
    });

program
    .command('bundle')
    .description('Bundle bermooda module configuration')
    .action(function() {
        bundler.bundle();
    });

program
    .command('watch:config')
    .description('Start watching bermooda.json module config files')
    .action(function() {
        watcher.watch();
    });

program
    .command('*')
    .action(function(cmd) {
        console.log(cmd + ' is not a valid command, try -h to get help');
        process.exit(1);
    });

program.parse(process.argv);
