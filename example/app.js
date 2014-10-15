var React = require('react');

var Inspector = require('../json-inspector.jsx');
var data = require('./data.json');

document.addEventListener('DOMContentLoaded', function() {
    React.renderComponent(Inspector({ data: data }), document.getElementById('inspector'));
});
