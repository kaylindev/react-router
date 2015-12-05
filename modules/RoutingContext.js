import deprecateObjectProperties from './deprecateObjectProperties'
import invariant from 'invariant'
import React, { Component } from 'react'
import { isReactChildren } from './RouteUtils'
import getRouteParams from './getRouteParams'

const { array, func, object } = React.PropTypes

class RoutingContext extends Component {

  getChildContext() {
    const { history, location } = this.props
    const router = {
      push(...args) {
        history.push(...args)
      },
      replace(...args) {
        history.replace(...args)
      },
      addRouteLeaveHook(...args) {
        return history.listenBeforeLeavingRoute(...args)
      },
      isActive(...args) {
        return history.isActive(...args)
      }
    }
    return deprecateObjectProperties({ history, location, router }, {
      history: '`context.history` is deprecated, please use context.router',
      location: '`context.location` is deprecated, please use a route component\'s `props.location` instead. If this is a deeply nested component, please refer to the strategies described in https://github.com/rackt/react-router/blob/v1.1.0/CHANGES.md#v110'
    })
  }

  createElement(component, props) {
    return component == null ? null : this.props.createElement(component, props)
  }

  render() {
    const { history, location, routes, params, components } = this.props
    let element = null

    if (components) {
      element = components.reduceRight((element, components, index) => {
        if (components == null)
          return element // Don't create new children; use the grandchildren.

        const route = routes[index]
        const routeParams = getRouteParams(route, params)
        const props = {
          history,
          location,
          params,
          route,
          routeParams,
          routes
        }

        if (isReactChildren(element)) {
          props.children = element
        } else if (element) {
          for (let prop in element)
            if (element.hasOwnProperty(prop))
              props[prop] = element[prop]
        }

        if (typeof components === 'object') {
          const elements = {}

          for (const key in components) {
            if (components.hasOwnProperty(key)) {
              // Pass through the key as a prop to createElement to allow
              // custom createElement functions to know which named component
              // they're rendering, for e.g. matching up to fetched data.
              elements[key] = this.createElement(components[key], {
                key, ...props
              })
            }
          }

          return elements
        }

        return this.createElement(components, props)
      }, element)
    }

    invariant(
      element === null || element === false || React.isValidElement(element),
      'The root route must render a single element'
    )

    return element
  }

}

RoutingContext.propTypes = {
  history: object.isRequired,
  createElement: func.isRequired,
  location: object.isRequired,
  routes: array.isRequired,
  params: object.isRequired,
  components: array.isRequired
}

RoutingContext.defaultProps = {
  createElement: React.createElement
}

RoutingContext.childContextTypes = {
  history: object.isRequired,
  location: object.isRequired,
  router: object.isRequired
}

export default RoutingContext
