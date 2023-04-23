import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { usePromise } from "./use-promise";

const testPromise = () =>
  new Promise((resolve) => setTimeout(() => resolve(42), 100));

describe("usePromise", () => {
  test("basic flow", async () => {
    const { result } = renderHook(() => usePromise(testPromise));
    // auto starts by default
    expect(result.current.state.name).toBe("pending");

    // eventually resolves
    await waitFor(() => expect(result.current.state.name).toBe("resolved"));
    if (result.current.state.name === "resolved") {
      expect(result.current.state.value).toBe(42);
    } else {
      throw new Error(
        `resolved state not found or has invalid value: ${JSON.stringify(
          result.current.state
        )}`
      );
    }
  });

  test("manual starts", async () => {
    const { result } = renderHook(() =>
      usePromise(testPromise, { autoInvoke: false })
    );
    // does not auto start
    expect(result.current.state.name).toBe("idle");

    // can be started manually
    act(() => {
      result.current.start();
    });
    expect(result.current.state.name).toBe("pending");

    // eventually resolves
    await waitFor(() => expect(result.current.state.name).toBe("resolved"));
    if (result.current.state.name === "resolved") {
      expect(result.current.state.value).toBe(42);
    } else {
      throw new Error(
        `resolved state not found or has invalid value: ${JSON.stringify(
          result.current.state
        )}`
      );
    }
  });

  test("cancel", () => {
    const { result } = renderHook(() => usePromise(testPromise));
    // auto starts by default
    expect(result.current.state.name).toBe("pending");

    // can be cancelled
    act(() => {
      result.current.cancel();
    });

    expect(result.current.state.name).toBe("idle");
  });
});
