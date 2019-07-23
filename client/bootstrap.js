import '@material/mwc-icon'
import { APPEND_CONTEXT_TOOL } from '@things-factory/context-base'
import { openOverlay, TOOL_POSITION } from '@things-factory/layout-base'
import { store } from '@things-factory/shell'
import { html } from 'lit-html'

export default function bootstrap() {
  import('./layout/screencast-panel')

  function openContextToolbarOverlay() {
    openOverlay('context-toolbar-overlay', {
      template: html`
        <print-context-template></print-context-template>
      `
    })
  }

  store.dispatch({
    type: APPEND_CONTEXT_TOOL,
    tool: {
      template: html`
        <mwc-icon
          @click=${e => openContextToolbarOverlay}
          style="padding: 10px; background-color: var(--secondary-color); color: white;"
          >cast_connected</mwc-icon
        >
      `,
      position: TOOL_POSITION.FRONT_END,
      context: 'screencastable'
    }
  })
}
