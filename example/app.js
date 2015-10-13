var render = require('react-dom').render;
var createFactory = require('react').createFactory;

var Inspector = require('..');
var inspector = createFactory(Inspector);
var InteractiveSelection = require('./interactive-selection');
var interactiveSelection = createFactory(InteractiveSelection);

var data = require('./data.json');

document.addEventListener('DOMContentLoaded', function() {
    render(
        inspector({
            data: data,
            onClick: console.log.bind(console),
            interactiveLabel: interactiveSelection
        }),
        document.getElementById('inspector')
    );
});
