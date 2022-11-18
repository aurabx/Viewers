import React, { useEffect, useState } from 'react';

export default function Toolbar({ servicesManager }) {
  const { ToolBarService } = servicesManager.services;
  const [toolbarButtons, setToolbarButtons] = useState([]);
  const [buttonState, setButtonState] = useState({
    primaryToolId: '',
    toggles: {},
    groups: {},
  });

  // Could track buttons and state separately...?
  useEffect(() => {
    const { unsubscribe: unsub1 } = ToolBarService.subscribe(
      ToolBarService.EVENTS.TOOL_BAR_MODIFIED,
      () => setToolbarButtons(ToolBarService.getButtonSection('primary'))
    );
    const { unsubscribe: unsub2 } = ToolBarService.subscribe(
      ToolBarService.EVENTS.TOOL_BAR_STATE_MODIFIED,
      () => setButtonState({ ...ToolBarService.state })
    );

    return () => {
      unsub1();
      unsub2();
    };
  }, [ToolBarService]);

  return (
    <>
      {toolbarButtons.map((toolDef, index) => {
        const { id, Component, componentProps } = toolDef;
        // TODO: ...

        // isActive if:
        // - id is primary?
        // - id is in list of "toggled on"?
        let isActive;
        if (componentProps.type === 'toggle') {
          isActive = buttonState.toggles[id];
        }
        // Also need... to filter list for splitButton, and set primary based on most recently clicked
        // Also need to kill the radioGroup button's magic logic
        // Everything should be reactive off these props, so commands can inform ToolbarService

        // These can... Trigger toolbar events based on updates?
        // Then sync using useEffect, or simply modify the state here?
        return (
          <Component
            key={id}
            id={id}
            {...componentProps}
            bState={buttonState}
            isActive={isActive}
            onInteraction={args => ToolBarService.recordInteraction(args)}
            servicesManager={servicesManager}
          />
        );
      })}
    </>
  );
}
