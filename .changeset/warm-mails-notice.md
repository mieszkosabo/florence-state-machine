---
"@florence-state-machine/core": minor
---

Add possibility for an effect to return nothing. If an effect doesn't retun an event, then no event is sent to the machine after the effect is executed. Also it is possible for an effect to be a simple void funtion.
