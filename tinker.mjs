import { timer } from "rxjs";

timer(0, 1000).subscribe((n) => console.log("timer", n));
