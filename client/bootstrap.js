import { APPEND_APP_TOOL } from '@things-factory/apptool-base'
import { appendViewpart, toggleOverlay, TOOL_POSITION, VIEWPART_POSITION } from '@things-factory/layout-base'
import { store } from '@things-factory/shell'
import { html } from 'lit-html'
import '@material/mwc-icon'

export default function bootstrap() {
  import('./layout/screencast-panel')

  appendViewpart({
    name: 'screencaster',
    viewpart: {
      show: false,
      hovering: 'edge',
      template: html`
        <screencast-panel></screencast-panel>
      `
    },
    position: VIEWPART_POSITION.FOOTERBAR
  })

  store.dispatch({
    type: APPEND_APP_TOOL,
    tool: {
      template: html`
        <mwc-icon @click=${e => toggleOverlay('screencaster')}>cast_connected</mwc-icon>
      `,
      position: TOOL_POSITION.REAR_END
    }
  })
}
