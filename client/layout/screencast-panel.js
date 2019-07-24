import { ContextToolbarOverlayStyle } from '@things-factory/context-ui'
import {
  addScreencastServices,
  changeScreencastServices,
  removeScreencastServices
} from '@things-factory/screencast-base'
import { ScrollbarStyles, store } from '@things-factory/shell'
import { html, LitElement } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

function read_cookie(name) {
  var cookieObject = document.cookie
    .split(';')
    .map(c => {
      return c
        .trim()
        .split('=')
        .map(decodeURIComponent)
    })
    .reduce((a, b) => {
      try {
        a[b[0]] = JSON.parse(b[1])
      } catch (e) {
        a[b[0]] = b[1]
      }
      return a
    }, {})

  return cookieObject[name]
}

class ScreencastPanel extends connect(store)(LitElement) {
  static get properties() {
    return {
      _services: Array,
      _currentService: Object
    }
  }

  static get styles() {
    return [ScrollbarStyles, ContextToolbarOverlayStyle]
  }

  render() {
    return html`
      ${(this._services || []).map(
        (service, idx) => html`
          <label for="${idx}">
            <li
              .serviceObject=${service}
              @click=${e => {
                var obj = e.currentTarget.serviceObject
                this._currentService = obj
              }}
            >
              <mwc-icon>live_tv</mwc-icon>
              <span>${service.name}</span>
            </li>
          </label>
        `
      )}
    `
  }

  connectedCallback() {
    super.connectedCallback()

    if (window.cordova_iab)
      window.cordova_iab.postMessage(
        JSON.stringify({
          type: 'screencast-service-loaded'
        })
      )

    window.addEventListener('message', e => {
      var message = e.data
      switch (message.type) {
        case 'added':
          store.dispatch(
            addScreencastServices({
              service: message.service
            })
          )
          break
        case 'changed':
          store.dispatch(
            changeScreencastServices({
              service: message.service
            })
          )
          break
        case 'removed':
          store.dispatch(
            removeScreencastServices({
              service: message.service
            })
          )
          break
      }
    })
  }

  updated(changed) {
    if (changed.has('_currentService')) this.onCurrentServiceChanged()
  }

  stateChanged(state) {
    this._services = state.screencast.services
  }

  onCurrentServiceChanged() {
    if (window.cordova_iab && this._currentService) {
      window.cordova_iab.postMessage(
        JSON.stringify({
          type: 'screencast-service-selected',
          service: this._currentService,
          params: {
            token: read_cookie('access_token'),
            url: location.href
          }
        })
      )

      this._currentService = null
    }
  }
}

customElements.define('screencast-panel', ScreencastPanel)
