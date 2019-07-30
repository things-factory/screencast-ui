import '@material/mwc-icon'
import { APPEND_CONTEXT_TOOL } from '@things-factory/context-base'
import { openOverlay, TOOL_POSITION } from '@things-factory/layout-base'
import { store } from '@things-factory/shell'
import { html } from 'lit-html'
import { updateScreencastServices } from '@things-factory/screencast-base'

import './layout/screencast-panel'

export default function bootstrap() {
  async function fetchScreencastServices() {
    var response = await fetch('/screencast-services')
    var json = await response.json()
    return json.screencasts
  }

  function openContextToolbarOverlay() {
    openOverlay('context-toolbar-overlay', {
      template: html`
        <screencast-panel></screencast-panel>
      `
    })
  }

  store.dispatch({
    type: APPEND_CONTEXT_TOOL,
    tool: {
      template: html`
        <mwc-icon
          @click=${async e => {
            openContextToolbarOverlay(e)
            var services = await fetchScreencastServices()
            store.dispatch(
              updateScreencastServices({
                services
              })
            )
          }}
          >cast_connected</mwc-icon
        >
      `,
      position: TOOL_POSITION.FRONT_END,
      context: 'screencastable'
    }
  })
}
