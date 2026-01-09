import { describe, it, beforeEach, expect } from "vitest";
import { createAppFixture } from "../../helpers/app-fixture";
import { itemA } from "../../shared/fixtures/items";
import { Actor } from "../core";
import { StartNewRequest, AddItem, Compute } from "../tasks";
import { ResultStatus, ResultError } from "../questions";
import { STATUS } from "../../../app/src/types";

const fixture = createAppFixture({
  expectedUrl: "http://service.local/compute",
  response: { status: "FAILED", error: "Boom" },
});

let trader: Actor;

describe("Server reports a failure", () => {
  beforeEach(() => {
    trader = new Actor("Trader", fixture.app);
  });

  it("propagates the error from the server", async () => {
    await trader.attemptsTo(new StartNewRequest(), new AddItem(itemA), new Compute());
    expect(await trader.asks(new ResultStatus())).toBe(STATUS.FAILED);
    expect(await trader.asks(new ResultError())).toBe("Boom");
  });
});
