var React = require('react');

var Inspector = require('../json-inspector.jsx');
var inspector = React.createFactory(Inspector);
var data = require('./data.json');

document.addEventListener('DOMContentLoaded', function() {
    React.render(inspector({ data: data }), document.getElementById('inspector'));
});
