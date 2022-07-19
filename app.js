const app = require('express')()

app.get('/health', function (req, res) {
  res.status(200).json({
    'success': true
  });
});


module.exports = app;
