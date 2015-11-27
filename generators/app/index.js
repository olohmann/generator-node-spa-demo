'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var slugify = require('slugify');
var files = require('expand-files');
var isdir = require('is-directory');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    this.log(([
      'Welcome ',
      '',
      '  _________   ______        _____        _____      ',
      ' /________/\\ /_____/\\      /_____/\\     /_____/\\    ',
      ' \\__.::.__\\/ \\:::_ \\ \\     \\:::_:\\ \\    \\:::_:\\ \\   ',
      '    \\::\\ \\    \\:(_) ) )_       _\\:\\|        _\\:\\|   ',
      '     \\::\\ \\    \\: __ `\\ \\     /::_/__      /::_/__  ',
      '      \\::\\ \\    \\ \\ `\\ \\ \\    \\:\\____/\\    \\:\\____/\\',
      '       \\__\\/     \\_\\/ \\_\\/     \\_____\\/     \\_____\\/',
      '',
      'to the legendary ' + chalk.red('generator-node-spa-demo') + '!',
      ''].join('\n')
    ));

    var prompts = [{
      name: 'appname',
      message: 'What is the name of the project?',
      default: this.appname
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.props.appname = slugify(this.props.appname);
      done();
    }.bind(this));
  },

  writing: function () {
    processDirectory.bind(this)(this.templatePath('.'), this.destinationPath('.'));
  },

  install: function () {
    this.installDependencies();
  }
});

function processDirectory(source, destination) {
    var config = files({ cwd: source });
    var fileMappings = config.expand({src: ['**/*.*', '.*', '.*/**'], dest: destination, mapDest: true});

    for (var i = 0; i < fileMappings.files.length; i++) {
        var src = fileMappings.files[i].src[0];
        var dest = fileMappings.files[i].dest;
        if (path.basename(dest).indexOf('_') === 0) {
            var dest = path.join(path.dirname(dest), path.basename(dest).replace(/^_/, ''));
            this.template(src, dest, this.props);
        }  else {
            if (!dest.endsWith(".vscode")) {
              this.copy(src, dest);
            }
        }
    }
}
