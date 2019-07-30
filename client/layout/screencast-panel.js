import { ContextToolbarOverlayStyle } from '@things-factory/context-ui'
import { ScrollbarStyles, store } from '@things-factory/shell'
import { css, html, LitElement } from 'lit-element'
import { closeOverlay } from '@things-factory/layout-base'
import { connect } from 'pwa-helpers/connect-mixin.js'

class ScreencastPanel extends connect(store)(LitElement) {
  static get properties() {
    return {
      _services: Array,
      _currentService: Object
    }
  }

  static get styles() {
    return [
      ScrollbarStyles,
      ContextToolbarOverlayStyle,
      css`
        :host {
          min-height: 200px;
        }

        [nolist] {
        }
      `
    ]
  }

  render() {
    return html`
      ${!this._services || this._services.length == 0
        ? html`
            <div nolist>No hatio TV is found</div>
          `
        : this._services.map(
            (service, idx) => html`
              <label for="${idx}">
                <li @click=${e => this._requestScreencast(service)}>
                  <mwc-icon>live_tv</mwc-icon>
                  <span>${service.name}</span>
                </li>
              </label>
            `
          )}
    `
  }

  updated(changed) {
    if (changed.has('_currentService')) this.onCurrentServiceChanged()
  }

  stateChanged(state) {
    this._services = state.screencast.services
  }

  async _requestScreencast(service) {
    if (service) {
      var serviceName = service.name
      var response = await fetch(`/screencast/${serviceName}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          url: location.href
        })
      })

      var json = await response.json()
      if (json.success) {
        closeOverlay('context-toolbar-overlay')
      }
    }
  }
}

customElements.define('screencast-panel', ScreencastPanel)
