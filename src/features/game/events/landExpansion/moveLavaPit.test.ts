import Decimal from "decimal.js-light";
import { moveLavaPit } from "./moveLavaPit";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("moveLavaPit", () => {
  it("ensures the lava pit exists", () => {
    expect(() =>
      moveLavaPit({
        action: {
          coordinates: {
            x: 1,
            y: 1,
          },
          id: "2",
          type: "lavaPit.moved",
        },
        state: {
          ...INITIAL_FARM,
          lavaPits: {
            "1": {
              x: 1,
              y: 1,
              createdAt: 0,
            },
          },
        },
      }),
    ).toThrow("Lava pit #2 does not exist");
  });

  it("moves a lava pit", () => {
    const state = moveLavaPit({
      action: {
        coordinates: {
          x: 5,
          y: 6,
        },
        id: "1",
        type: "lavaPit.moved",
      },
      state: {
        ...INITIAL_FARM,
        buildings: {},
        inventory: {
          "Lava Pit": new Decimal(2),
        },
        lavaPits: {
          "1": {
            x: 1,
            y: 1,
            createdAt: 0,
          },
        },
      },
    });

    expect(state.lavaPits).toEqual({
      "1": {
        x: 5,
        y: 6,
        createdAt: 0,
      },
    });
  });
});
