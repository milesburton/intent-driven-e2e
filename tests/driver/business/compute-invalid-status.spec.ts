import { describe, it, expect } from "vitest";
import { createAppFixture } from "../../helpers/app-fixture";
import { itemA } from "../../shared/fixtures/items";
import { ERRORS, STATUS } from "../../../app/src/types";

const fixture = createAppFixture({
  expectedUrl: "http://service.local/compute",
  response: { status: "FAILED" },
});

describe("Server returns failure without error", () => {
  it("maps to FAILED with UNKNOWN error", async () => {
    await fixture.app.startNewRequest();
    await fixture.app.addItem(itemA);

    const result = await fixture.app.compute();

    expect(result.status).toBe(STATUS.FAILED);
    expect(result.error).toBe(ERRORS.UNKNOWN);
    expect(result.pv).toBeUndefined();
  });
});
