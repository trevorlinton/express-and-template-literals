const express = require('express');
const app = express();
const parser = require('body-parser');

app.use(parser.urlencoded({ extended: true }));
let todo = [];

function grab(file) {
  try {
    return require(file);
  } finally {
    process.env.DEV_MODE === 'true' &&
      Object.keys(require.cache)
        .filter((x) => x.endsWith(file.replace(/\.\//g, '')))
        .map((x) => delete require.cache[x]);
  }
}

app.listen(process.env.PORT || "9000", (err) => {
  if(err) {
    console.error(err);
    process.exit(1);
  }
  app.use(express.static('./public/'));
  app.get(['/tasks','/'], async(req, res, next) => 
    res.send(grab('./views/index.html')(req, {todo})));
  app.post('/tasks', async(req, res, next) => {
    todo.push({
      ...req.body,
      id:todo.length, 
      created:new Date(), 
      finished:null
    });
    res.redirect('/tasks');
  });
  app.post('/tasks/:id/done', async(req, res, next) => {
    todo[req.params.id].finished = new Date();
    res.redirect('/tasks');
  });
});