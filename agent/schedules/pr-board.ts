// Export shape per node_modules/eve/docs/schedules.mdx, confirmed against
// the installed package's dist/src/public/definitions/schedule.d.ts
// (docs/eve-api-notes.md fact 1).
import { defineSchedule } from "eve/schedules";
import { prBoardTick } from "../lib/tick-entry";

export default defineSchedule({
  cron: "0 */4 * * *", // every 4 hours — workday check-in cadence
  async run({ receive, waitUntil, appAuth }) {
    // waitUntil extends the cron task's lifetime past return so the
    // durable session (and any in-flight fetches inside runTick) settle
    // before the Nitro task ends (docs/eve-api-notes.md fact 1). All tick
    // logic lives in agent/lib/tick.ts / tick-entry.ts — this handler does
    // nothing but forward the schedule's own receive/appAuth.
    waitUntil(prBoardTick({ receive, appAuth }));
  },
});
