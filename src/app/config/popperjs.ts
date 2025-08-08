// showDelay number 0
// disableAnimation	boolean	false
// disableDefaultStyling	boolean	false
// placement	Placement(string)	auto
// boundariesElement	string(selector)	undefined
// trigger	Trigger(string)	hover
// positionFixed	boolean	false
// hideOnClickOutside	boolean	true
// hideOnMouseLeave	boolean	false
// hideOnScroll	boolean	false
// applyClass	string	undefined
// styles	Object	undefined
// applyArrowClass	string	undefined
// ariaDescribeBy	string	undefined
// ariaRole	string	undefined
// appendTo	string	undefined
// preventOverflow	boolean	undefined

import {
  type NgxPopperjsOptions,
  // NgxPopperjsPlacements,
  NgxPopperjsTriggers,
} from "ngx-popperjs";
export const PopperjsConfig = <NgxPopperjsOptions>{
  // disableDefaultStyling: true,
  hideOnScroll: true,
  // placement: NgxPopperjsPlacements.BOTTOM,
  trigger: NgxPopperjsTriggers.click,
  applyClass: "",
  styles: {},
  applyArrowClass: "hidden",
};
