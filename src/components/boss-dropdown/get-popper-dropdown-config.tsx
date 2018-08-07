// import Popper from 'popper.js';
// import get from 'lodash/get';
// import toString from 'lodash/toString';
import hasClass from '../../utilities/has-class';

const AttachmentMap = {
  TOP       : 'top-start',
  TOPEND    : 'top-end',
  BOTTOM    : 'bottom-start',
  BOTTOMEND : 'bottom-end',
  RIGHT     : 'right-start',
  RIGHTEND  : 'right-end',
  LEFT      : 'left-start',
  LEFTEND   : 'left-end'
}

const ClassName = {
  DISABLED  : 'disabled',
  SHOW      : 'show',
  DROPUP    : 'dropup',
  DROPRIGHT : 'dropright',
  DROPLEFT  : 'dropleft',
  MENURIGHT : 'dropdown-menu-right',
  MENULEFT  : 'dropdown-menu-left',
  POSITION_STATIC : 'position-static'
}

function getPlacement(dropdownEl, dropdownMenuEl) {
  let placement = AttachmentMap.BOTTOM

  // Handle dropup
  if (hasClass(dropdownEl, ClassName.DROPUP)) {
    placement = AttachmentMap.TOP
    if (hasClass(dropdownMenuEl, ClassName.DROPUP)) {
      placement = AttachmentMap.TOPEND
    }
  } else if (hasClass(dropdownEl, ClassName.DROPRIGHT)) {
    placement = AttachmentMap.RIGHT
  } else if (hasClass(dropdownEl, ClassName.DROPLEFT)) {
    placement = AttachmentMap.LEFT
  } else if (hasClass(dropdownEl, ClassName.MENURIGHT)) {
    placement = AttachmentMap.BOTTOMEND
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
      }
    }
  }

  // Disable Popper.js if we have a static display
  if (popperSettings.display === 'static') {
    popperConfig.modifiers.applyStyle = {
      enabled: false
    }
  }
  return popperConfig;
}