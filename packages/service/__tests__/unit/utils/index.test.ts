import { createApiResponse } from "../../../src/utils";

describe("Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createApiResponse", () => {
    it("should return data when provided", () => {
      const data = { status: "healthy" };
      const result = createApiResponse(data);
      expect(result).toBe(data);
    });

    it("should return error string when provided", () => {
      const error = "Not implemented";
      const result = createApiResponse(error);
      expect(result).toBe(error);
    });

    it("should return string data when type is different", () => {
      const data = "Some data";
      const result = createApiResponse<number>(data);
      expect(result).toBe(data);
    });
  });
});
