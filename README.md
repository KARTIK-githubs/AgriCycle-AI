# AgriCycle AI

AgriCycle AI is a crop-residue planning prototype developed during the 1M1B AI for Sustainability virtual internship. It compares residue-management pathways based on cost, transport distance, machinery availability and user priorities. A Leaflet map supports location-based exploration, and the selected pathway can be turned into an action plan.

## Run locally

Use Node.js and npm.

```sh
npm ci
npm run dev
npm test
npm run build
```

## Project structure

- [`src/engine/solver.ts`](src/engine/solver.ts) implements pathway scoring.
- [`src/data`](src/data) contains example pathways and resources.
- [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) describes intended workflows.
- [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) documents planned verification.

The prototype uses seeded resource data. Confirm availability and costs locally before acting on an assessment.
