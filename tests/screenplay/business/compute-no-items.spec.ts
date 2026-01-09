import { expect, test } from "vitest";
import { createAppFixture } from "../../helpers/appFixture";
import { Actor } from "../core";
import { StartNewRequest, Compute } from "../tasks";
import { ResultStatus, ResultValue } from "../questions";
import { STATUS } from "../../../app/src/types";

const fixture = createAppFixture();

test("compute with no items returns FAILED", async () => {
  const trader = new Actor("Trader", fixture.app);
  await trader.attemptsTo(new StartNewRequest(), new Compute());

  expect(await trader.asks(new ResultStatus())).toBe(STATUS.FAILED);
  expect(await trader.asks(new ResultValue())).toBeUndefined();
});
