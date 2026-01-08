import { describe, expect, it } from "vitest";
import { placeholder } from "../src/index";

describe("placeholder", () => {
  it("exports a value", () => {
    expect(placeholder).toBe("ach-banking-days");
  });
});
