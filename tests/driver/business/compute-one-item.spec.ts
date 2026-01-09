import { describe, it, expect } from "vitest";
import { createAppFixture } from "../../helpers/app-fixture";
import { itemA } from "../../shared/fixtures/items";
import { STATUS } from "../../../app/src/types";

const fixture = createAppFixture({
  expectedUrl: "http://service.local/compute",
  response: { status: "COMPLETED", value: 42 },
});

describe("Compute a single item", () => {
  it("returns COMPLETED with custom value", async () => {
    await fixture.app.startNewRequest();
    await fixture.app.addItem(itemA);

    const result = await fixture.app.compute();

    expect(result.status).toBe(STATUS.COMPLETED);
    expect(result.value).toBe(42);
  });
});
