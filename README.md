# React JSON Inspector Component

![Component screenshot](http://i.imgur.com/8619dv9.png)

React-based JSON inspector that features tree expansion and search with jump
functionality.

### Installation

    npm install react-json-inspector

### Usage

```jsx
var Inspector = require('react-json-inspector');
var data = { /* ... */ };

React.render(
    <Inspector data={ data } />,
    document.getElementById('inspector')
);
```

Make sure to include `json-inspector.css` in your stylesheet. Feel free to
override or amend default styles, for instance, when using a dark background.

### Properties

#### props.data

JSON object or array to inspect.

#### props.className

The class name to be added to the root component element.

#### props.search

Boolean flag, commands whether inspector should have a search field or not.
