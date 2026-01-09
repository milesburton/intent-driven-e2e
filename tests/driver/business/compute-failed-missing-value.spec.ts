import { describe, it, expect } from "vitest";
import { createAppFixture } from "../../helpers/app-fixture";
import { itemA } from "../../shared/fixtures/items";
import { ERRORS, STATUS } from "../../../app/src/types";

// Interceptor returns COMPLETED without value; app parser should convert to FAILED/MISSING_VALUE
const fixture = createAppFixture({
  expectedUrl: "http://service.local/compute",
  response: { status: "COMPLETED" },
});

describe("Server omits value on completed response", () => {
  it("maps to FAILED with MISSING_VALUE", async () => {
    await fixture.app.startNewRequest();
    await fixture.app.addItem(itemA);

    const result = await fixture.app.compute();

    expect(result.status).toBe(STATUS.FAILED);
    expect(result.error).toBe(ERRORS.MISSING_VALUE);
    expect(result.value).toBeUndefined();
  });
});
