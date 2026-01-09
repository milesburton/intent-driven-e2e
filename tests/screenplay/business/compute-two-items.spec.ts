import { expect, test } from "vitest";
import { createAppFixture } from "../../helpers/appFixture";
import { itemA, itemB } from "../../shared/fixtures/items";
import { Actor } from "../core";
import { StartNewRequest, AddItem, Compute } from "../tasks";
import { ResultStatus, ResultValue } from "../questions";

const fixture = createAppFixture();

test("compute two items", async () => {
  const trader = new Actor("Trader", fixture.app);

  await trader.attemptsTo(
    new StartNewRequest(),
    new AddItem(itemA),
    new AddItem(itemB),
    new Compute(),
  );

  expect(await trader.asks(new ResultStatus())).toBe("COMPLETED");
  expect(await trader.asks(new ResultValue())).toBe(123.45);
});
