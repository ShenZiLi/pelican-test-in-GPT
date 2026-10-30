# Runtime contracts

JavaScript ESM, no TypeScript or build step. Validate external values at boundaries: finiteTime in src/beat/clock.js; dimensions/framePlan in tools/common.mjs. Frozen SCENES and shared rig points act as contracts. Named exports and clear role keys connect rendering modules. Reject nonfinite time and invalid dimensions, do not silently corrupt frames.
