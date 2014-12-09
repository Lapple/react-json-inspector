var React = require('react');
var raf = require('raf');

var uid = require('./uid.js');
var type = require('./type.js');
var Highlighter = require('./highlighter.js');
var Selection = require('./selection.jsx');

var PATH_PREFIX = '.root.';

var Leaf = React.createClass({
    getInitialState: function() {
        var p = this.props;

        return {
            expanded: (p.query && !contains(this.path(), p.query) && p.getOriginal) || p.isRoot,
            shouldRenderChildren: false
        }
    },
    getDefaultProps: function() {
        return {
            isRoot: false,
            prefix: ''
        };
    },
    render: function() {
        var id = 'id_' + uid();
        var p = this.props;

        var d = {
            path: this.path().substr(PATH_PREFIX.length),
            key: p.label.toString(),
            value: p.data
        };

        return <div className={ this.rootClassName() } id={ 'leaf-' + this.path() }>
            <input className='json-inspector__radio' type='radio' name={ p.id } id={ id } />
            <label className='json-inspector__line' htmlFor={ id } onClick={ this._onClick.bind(this, d) }>
                <div className='json-inspector__flatpath'>
                    { d.path }
                </div>
                <span className='json-inspector__key'>
                    { this.format(d.key) }:
                    <Selection value={ d.key } />
                </span>
                { this.renderTitle() }
                { this.renderShowOriginalButton() }
            </label>
            { this.renderChildren() }
        </div>;
    },
    renderTitle: function() {
        var data = this.data();
        var t = type(data);

        switch (t) {
            case 'Array':
                return <span className='json-inspector__value json-inspector__value_helper'>
                    { '[] ' + items(data.length) }
                </span>;
            case 'Object':
                return <span className='json-inspector__value json-inspector__value_helper'>
                    { '{} ' + items(Object.keys(data).length) }
                </span>;
            default:
                return <span className={ 'json-inspector__value json-inspector__value_' + t.toLowerCase() }>
                    { this.format(String(data)) }
                    <Selection value={ String(data) } />
                </span>;
        }
    },
    renderChildren: function() {
        var p = this.props;
        var childPrefix = this.path();
        var data = this.data();

        if (!this.state.shouldRenderChildren || isPrimitive(data)) {
            return null;
        }

        if (this.state.expanded) {
            return Object.keys(data).map(function(key) {
                return <Leaf
                    data={ data[key] }
                    label={ key }
                    prefix={ childPrefix }
                    onClick={ p.onClick }
                    id={ p.id }
                    query={ p.query }
                    getOriginal={ this.state.original ? null : p.getOriginal }
                    key={ key } />;
            }, this);
        }
    },
    renderShowOriginalButton: function() {
        var p = this.props;

        if (isPrimitive(p.data) || this.state.original || !p.getOriginal || !p.query || contains(this.path(), p.query)) {
            return;
        }

        return <span className='json-inspector__show-original' onClick={ this._onShowOriginalClick } />;
    },
    componentDidMount: function() {
        this._scheduleChildrenRender();
    },
    componentWillUnmount: function() {
        raf.cancel(this._timeout);
    },
    componentWillReceiveProps: function(p) {
        if (p.query) {
            this.setState({
                expanded: !contains(p.label, p.query),
                shouldRenderChildren: false
            });
            this._scheduleChildrenRender();
        } else if (!p.isRoot) {
            this.setState({
                expanded: false
            });
        }
    },
    path: function() {
        return this.props.prefix + '.' + this.props.label;
    },
    data: function() {
        return this.state.original || this.props.data;
    },
    format: function(string) {
        return <Highlighter string={ string } highlight={ this.props.query } />;
    },
    rootClassName: function() {
        var cn = 'json-inspector__leaf';

        if (this.props.isRoot) {
            cn += ' json-inspector__leaf_root';
        }

        if (this.state.expanded) {
            cn += ' json-inspector__leaf_expanded';
        }

        if (!isPrimitive(this.props.data)) {
            cn += ' json-inspector__leaf_composite';
        }

        return cn;
    },
    toggle: function() {
        this.setState({
            expanded: !this.state.expanded
        });
    },
    _onClick: function(data, e) {
        this.toggle();
        this.props.onClick(data);

        e.stopPropagation();
    },
    _onShowOriginalClick: function(e) {
        this.setState({
            original: this.props.getOriginal(this.path().substr(PATH_PREFIX.length))
        });

        e.stopPropagation();
    },
    _scheduleChildrenRender: function() {
        this._timeout = raf(this._setRenderChildren);
    },
    _setRenderChildren: function() {
        this.setState({
            shouldRenderChildren: true
        });
    }
});

function items(count) {
    return count + (count === 1 ? ' item' : ' items');
}

function contains(string, substring) {
    return string.indexOf(substring) !== -1;
}

function isPrimitive(value) {
    var t = type(value);
    return t !== 'Object' && t !== 'Array';
}

module.exports = Leaf;
