import { inject, Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { M_mailSendMessage } from "../../graphql";

@Injectable({
  providedIn: "root",
})
export class UseMailService {
  private $apollo = inject(Apollo);
  send(to: string, subject: string, template: string, context: any = {}) {
    return this.$apollo.mutate({
      mutation: M_mailSendMessage,
      variables: {
        to,
        subject,
        template,
        context,
      },
    });
  }
}
