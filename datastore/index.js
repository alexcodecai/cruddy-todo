const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var filePath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw err;
    }
    //console.log(files);
    callback(null, _.map(files, (id, text) => {
      var newid = id.split('.');
      return {id: newid[0], text: newid[0]};
    }));
  });

};
// var data = _.map(items, (text, id) => {
//   return { id, text };
// });
// callback(null, data);
// };

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: text.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];

  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, (err, oldtext) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, () => {
        {
          callback(null, { id, text: text.toString() });
        }
      });
    }

  });

};

exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};