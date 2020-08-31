import search from "../helpers/search";

describe("search", () => {
  it("should search for a string via the api", () => {
    const searchText = "Test";
    const apiCall = jest
      .fn()
      .mockReturnValueOnce(jest.fn().mockReturnValueOnce([{ name: "result" }]));
    const conversion = (r: any) => `${r.name} converted`;

    const searchFunction = search(apiCall, conversion, "token");
    const result = searchFunction(searchText, null, false, "");
    expect(result).toStrictEqual([{ name: "result" }]);
    expect(apiCall).toBeCalledTimes(1);
    expect(apiCall).toBeCalledWith("test");
  });

  it("should not search if empty string", async () => {
    const searchText = "";
    const apiCall = jest
      .fn()
      .mockReturnValueOnce(jest.fn().mockReturnValueOnce([{ name: "result" }]));
    const conversion = (r: any) => `${r.name} converted`;

    const searchFunction = search(apiCall, conversion, "token");
    const result = await searchFunction(searchText, null, false, "");
    expect(result).toStrictEqual([]);
    expect(apiCall).toBeCalledTimes(0);
  });

  it("should search locally if local results are found", async () => {
    const searchText = "Test";
    const apiCall = jest
      .fn()
      .mockReturnValueOnce(jest.fn().mockReturnValueOnce([{ name: "result" }]));
    const localResult = [{ name: "test result" }];
    const conversion = (r: any) => `${r.name} converted`;

    const searchFunction = search(apiCall, conversion, "token");
    const result = await searchFunction(searchText, localResult, false, "");
    expect(result).toStrictEqual(["test result converted"]);
    expect(apiCall).toBeCalledTimes(0);
  });

  it("should not search locally if string is an extension of previous search and no previous results", async () => {
    const searchText = "try a";
    const apiCall = jest
      .fn()
      .mockReturnValueOnce(jest.fn().mockReturnValueOnce([{ name: "result" }]));
    const localResult = [{ name: "test result" }];
    const conversion = (r: any) => `${r.name} converted`;

    const searchFunction = search(apiCall, conversion, "token");
    const result = await searchFunction(searchText, localResult, false, "try");
    expect(result).toStrictEqual([]);
    expect(apiCall).toBeCalledTimes(0);
  });

  it("should search via the api if string is an extension of previous search and there are previous results", () => {
    const searchText = "test r";
    const apiCall = jest
      .fn()
      .mockReturnValueOnce(jest.fn().mockReturnValueOnce([{ name: "result" }]));
    const conversion = (r: any) => `${r.name} converted`;

    const searchFunction = search(apiCall, conversion, "token");
    const result = searchFunction(searchText, null, true, "test");
    expect(result).toStrictEqual([{ name: "result" }]);
    expect(apiCall).toBeCalledTimes(1);
    expect(apiCall).toBeCalledWith("test r");
  });

  it("should not search via the api if string is an extension of previous search and no previous results", async () => {
    const searchText = "test r";
    const apiCall = jest
      .fn()
      .mockReturnValueOnce(jest.fn().mockReturnValueOnce([{ name: "result" }]));
    const conversion = (r: any) => `${r.name} converted`;

    const searchFunction = search(apiCall, conversion, "token");
    const result = await searchFunction(searchText, null, false, "test");
    expect(result).toStrictEqual([]);
    expect(apiCall).toBeCalledTimes(0);
  });

  it("should search by first letter only if search string has only one char", async () => {
    const searchText = "T";
    const apiCall = jest
      .fn()
      .mockReturnValueOnce(jest.fn().mockReturnValueOnce([{ name: "result" }]));
    const localResult = [
      { name: "stu" },
      { name: "test result" },
      { name: "null" },
    ];
    const conversion = (r: any) => `${r.name} converted`;

    const searchFunction = search(apiCall, conversion, "token");
    const result = await searchFunction(searchText, localResult, false, "");
    expect(result).toStrictEqual(["test result converted"]);
    expect(apiCall).toBeCalledTimes(0);
  });

  it("should search via the api if last search was single char and current search is more", () => {
    const searchText = "Te";
    const apiCall = jest
      .fn()
      .mockReturnValueOnce(jest.fn().mockReturnValueOnce([{ name: "result" }]));
    const conversion = (r: any) => `${r.name} converted`;
    const searchFunction = search(apiCall, conversion, "token");
    const result = searchFunction(searchText, null, false, "t");
    expect(result).toStrictEqual([{ name: "result" }]);
    expect(apiCall).toBeCalledTimes(1);
    expect(apiCall).toBeCalledWith("te");
  });

  it("should search locally if last search was single char and current search is more", async () => {
    const searchText = "Te";
    const apiCall = jest
      .fn()
      .mockReturnValueOnce(jest.fn().mockReturnValueOnce([{ name: "result" }]));
    const localResult = [
      { name: "stu" },
      { name: "test result" },
      { name: "null" },
    ];
    const conversion = (r: any) => `${r.name} converted`;

    const searchFunction = search(apiCall, conversion, "token");
    const result = await searchFunction(searchText, localResult, false, "t");
    expect(result).toStrictEqual(["test result converted"]);
    expect(apiCall).toBeCalledTimes(0);
  });
});
