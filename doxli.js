var util = require('util');
var dox  = require('dox');
var fs   = require('fs');
var djs  = null;

function getdox(name) {
  return function () {
    var comment = djs.filter(function (i) {
      return i.ctx.name === name;
    })[0];
    var tags = comment.tags;
    var desc = comment.description.full;
    console.log(name + ' - ' + desc.replace(/(<([^>]+)>)/ig,"") + '\n');
    var i = 0;
    var p = 0;
    var op = "";
    for (i = 0; i < tags.length; i++) {
      switch(tags[i].type) {
        case 'example':
          console.log("Example:\n" + tags[i].string);
          break;
        case 'param':
          if(!p) {
            console.log("Parameters:");
            p++;
          }
          op = tags[i].optional ? "Optional. " : " ";
          console.log(
            '  ' + tags[i].name +
            ' (' + tags[i].types.toString() + ') - ' +
            op + tags[i].description + '\n'
          );
          break;
        case 'return':
          console.log(
            'Returns:\n  (' +
            tags[i].types.toString() +
            ') - ' + tags[i].description + '\n'
          );
          break;
        default:
          break;
      }
    }
  }
}

module.exports = function (file) {
  var obj = require(file);
  djs = dox.parseComments(fs.readFileSync(file).toString());
  for (var x in obj) {
    obj[x].help = getdox(x);
  }
}
