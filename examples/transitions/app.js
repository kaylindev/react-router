/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Routes = Router.Routes;
var Link = Router.Link;
var ActiveRouteHandler = Router.ActiveRouteHandler;

var App = React.createClass({
  render: function () {
    return (
      <div>
        <ul>
          <li><Link to="dashboard">Dashboard</Link></li>
          <li><Link to="form">Form</Link></li>
        </ul>
        <ActiveRouteHandler />
      </div>
    );
  }
});

var Home = React.createClass({
  render: function() {
    return <h1>Home</h1>;
  }
});

var Dashboard = React.createClass({
  render: function () {
    return <h1>Dashboard</h1>
  }
});

var Form = React.createClass({

  mixins: [ Router.Navigation ],

  statics: {
    willTransitionFrom: function (transition, component) {
      if (component.refs.userInput.getDOMNode().value !== '') {
        if (!confirm('You have unsaved information, are you sure you want to leave this page?')) {
          transition.abort();
        }
      }
    }
  },

  handleSubmit: function (event) {
    event.preventDefault();
    this.refs.userInput.getDOMNode().value = '';
    this.transitionTo('/');
  },

  render: function () {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <p>Click the dashboard link with text in the input.</p>
          <input type="text" ref="userInput" defaultValue="ohai" />
          <button type="submit">Go</button>
        </form>
      </div>
    );
  }
});

var routes = (
  <Route handler={App}>
    <DefaultRoute handler={Home}/>
    <Route name="dashboard" handler={Dashboard}/>
    <Route name="form" handler={Form}/>
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler />, document.getElementById('example'));
});
