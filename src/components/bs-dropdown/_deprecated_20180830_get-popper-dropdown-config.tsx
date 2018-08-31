import hasClass from '../../utilities/has-class';

function getPlacement(dropdownEl, dropdownMenuEl) {
  const AttachmentMap = {
    top: 'top-start',
    topend: 'top-end',
    bottom: 'bottom-start',
    bottomend: 'bottom-end',
    right: 'right-start',
    // RIGHTEND: 'right-end',
    left: 'left-start',
    // LEFTEND: 'left-end',
  };

  const ClassName = {
    // DISABLED: 'disabled',
    // SHOW: 'show',
    dropup: 'dropup',
    dropright: 'dropright',
    dropleft: 'dropleft',
    menuright: 'dropdown-menu-right',
    // MENULEFT: 'dropdown-menu-left',
    // POSITION_STATIC: 'position-static',
  };

  let placement = AttachmentMap.bottom;

  // Handle dropup
  if (hasClass(dropdownEl, ClassName.dropup)) {
    placement = AttachmentMap.top;
    if (hasClass(dropdownMenuEl, ClassName.dropup)) {
      placement = AttachmentMap.topend;
    }
  } else if (hasClass(dropdownEl, ClassName.dropright)) {
    placement = AttachmentMap.right;
  } else if (hasClass(dropdownEl, ClassName.dropleft)) {
    placement = AttachmentMap.left;
  } else if (hasClass(dropdownEl, ClassName.menuright)) {
    placement = AttachmentMap.bottomend;
  }
  return placement;
}

export default function getPopperDropdownConfig(dropdownEl, dropdownMenuEl, popperSettings) {
  const popperConfig: any = {
    placement: getPlacement(dropdownEl, dropdownMenuEl),
    modifiers: {
      offset: popperSettings.offset,
      flip: {
        enabled: popperSettings.flip,
      },
      preventOverflow: {
        boundariesElement: popperSettings.boundary,
      },
    },
  };

  // Disable Popper.js if we have a static display
  if (popperSettings.display === 'static') {
    popperConfig.modifiers.applyStyle = {
      enabled: false,
    };
  }
  return popperConfig;
}
