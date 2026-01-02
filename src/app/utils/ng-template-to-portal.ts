import type { TemplateRef } from "@angular/core";
import type { Portal } from "@angular/cdk/portal";
import { TemplatePortal } from "@angular/cdk/portal";

import type { CdkPortalFactoryOptions } from "../types";

/**
 * Create a CDK Portal ONLY from a TemplateRef -> TemplatePortal
 *
 * Notes:
 * - requires viewContainerRef (TemplatePortal needs it)
 * - optional context + injector are applied (CDK stores internally)
 */
export const ngTemplateToPortal = <T = unknown>(
  input: TemplateRef<T>,
  config: CdkPortalFactoryOptions
): Portal<unknown> => {
  const portal = new TemplatePortal(input, config.viewContainerRef!);

  // Optional context (<ng-template let-...>)
  if (config.context) (portal as any).context = config.context;

  // Optional injector (rarely needed)
  if (config.injector) (portal as any).injector = config.injector;

  return portal;
};
