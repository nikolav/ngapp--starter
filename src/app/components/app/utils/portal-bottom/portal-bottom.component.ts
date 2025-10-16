import { AfterViewInit, Component, inject, viewChild } from "@angular/core";
import { CdkPortal, PortalModule } from "@angular/cdk/portal";
import { Overlay } from "@angular/cdk/overlay";

@Component({
  selector: "app-portal-bottom",
  imports: [PortalModule],
  templateUrl: "./portal-bottom.component.html",
  styleUrl: "./portal-bottom.component.scss",
})
export class PortalBottomComponent implements AfterViewInit {
  private $overlay = inject(Overlay);

  portalBottom = viewChild("portalBottom", { read: CdkPortal });
  ngAfterViewInit(): void {
    const overlayRef = this.$overlay.create({
      positionStrategy: this.$overlay.position().global().bottom(),
      hasBackdrop: false,
      width: "100%",
    });
    overlayRef.attach(this.portalBottom());
  }
}
