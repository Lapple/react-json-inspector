var React = require('react');

var uid = require('./uid.js');
var Highlighter = require('./highlighter.jsx');

var ARRAY_TYPE = 'Array';
var OBJECT_TYPE = 'Object';
var PATH_PREFIX = '.root.';

var Leaf = React.createClass({
    getDefaultProps: function() {
        return {
            prefix: '',
            label: 'root'
        };
    },
    render: function() {
        var id = 'id_' + uid();
        var p = this.props;

        var d = {
            path: this.getCurrentPath().substr(PATH_PREFIX.length),
            key: p.label.toString(),
            value: p.data
        };

        return <div className={ 'json-inspector__leaf' + (p.isRoot ? ' json-inspector__leaf_root' : '') } id={ 'leaf-' + this.getCurrentPath() }>
            <input className='json-inspector__radio' type='radio' name={ p.id } id={ id } />
            <label className='json-inspector__line' htmlFor={ id } onClick={ this._onClick.bind(this, d) }>
                <div className='json-inspector__flatpath'>
                    { d.path }
                </div>
                <span className='json-inspector__key'>
                    { this.format(d.key) }:
                </span>
                { this.renderTitle() }
            </label>
            { this.renderChildren() }
        </div>;
    },
    renderTitle: function() {
        var data = this.props.data;
        var keyType = type(data);

        switch (keyType) {
            case ARRAY_TYPE:
                return <span className='json-inspector__value json-inspector__value_helper'>
                    { '[] ' + items(data.length) }
                </span>;
            case OBJECT_TYPE:
                return <span className='json-inspector__value json-inspector__value_helper'>
                    { '{} ' + items(Object.keys(data).length) }
                </span>;
            default:
                return <span className={ 'json-inspector__value json-inspector__value_' + keyType.toLowerCase() }>
                    { this.format(String(data)) }
                </span>;
        }
    },
    renderChildren: function() {
        var p = this.props;
        var childPrefix = this.getCurrentPath();

        switch (type(p.data)) {
            case ARRAY_TYPE:
                return p.data.map(function(value, index) {
                    return leaf({
                        data: value,
                        label: index,
                        prefix: childPrefix,
                        onClick: p.onClick,
                        id: p.id,
                        query: p.query,
                        updated: p.updated,
                        matches: p.matches,
                        key: index
                    });
                });
            case OBJECT_TYPE:
                return Object.keys(p.data).map(function(key) {
                    return leaf({
                        data: p.data[key],
                        label: key,
                        prefix: childPrefix,
                        onClick: p.onClick,
                        id: p.id,
                        query: p.query,
                        updated: p.updated,
                        matches: p.matches,
                        key: key
                    });
                });
            default:
                return null;
        }
    },
    getCurrentPath: function() {
        return this.props.prefix + '.' + this.props.label;
    },
    shouldComponentUpdate: function (p) {
        var path = this.getCurrentPath();
        var query = this.props.query;

        if (p.isRoot) {
            return true;
        }

        if (query && p.query.indexOf(query) === 0) {
            return (!p.updated || path in p.updated) || (!p.matches || path in p.matches);
        } else {
            return true;
        }
    },
    format: function(string) {
        return <Highlighter string={ string } query={ this.props.query } />;
    },
    _onClick: function(data, e) {
        this.props.onClick(data);
        e.stopPropagation();
    }
});

var leaf = React.createFactory(Leaf);

function type(object) {
    return Object.prototype.toString.call(object).slice(8, -1);
}

function items(count) {
    return count + (count === 1 ? ' item' : ' items');
}

module.exports = Leaf;
