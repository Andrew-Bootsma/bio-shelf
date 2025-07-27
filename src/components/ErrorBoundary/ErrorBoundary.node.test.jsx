import { expect, test, describe, vi, afterEach, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import React from "react";
import ErrorBoundary from "./ErrorBoundary";

// Mock console.error to avoid cluttering test output
const originalConsoleError = console.error;

beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  cleanup();
  console.error = originalConsoleError;
});

// Mock the Link component from react-router
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, className, to, reloadDocument }) => (
    <a className={className} href={to} data-reload={reloadDocument}>
      {children}
    </a>
  ),
}));

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  test("renders children when there is no error", () => {
    const screen = render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Test content")).toBeDefined();
    expect(screen.queryByText("Uh oh!")).toBeNull();
  });

  test("catches errors and displays error UI", () => {
    const screen = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Uh oh!")).toBeDefined();
    expect(screen.getByText(/There was an error with this page/)).toBeDefined();
    expect(screen.queryByText("No error")).toBeNull();
  });

  test("logs error to console", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalledWith(
      "ErrorBoundary caught some stupid error",
      expect.any(Error),
      expect.any(Object),
    );
  });

  test("renders link to home page with correct attributes", () => {
    const screen = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    const link = screen.getByText("Click here");
    expect(link.className).toBe("button");
    expect(link.getAttribute("href")).toBe("/");
    expect(link.getAttribute("data-reload")).toBe("true");
  });

  test("handles multiple child components", () => {
    const screen = render(
      <ErrorBoundary>
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("First child")).toBeDefined();
    expect(screen.getByText("Second child")).toBeDefined();
    expect(screen.getByText("Third child")).toBeDefined();
  });

  test("catches errors from nested components", () => {
    const NestedComponent = () => (
      <div>
        <ThrowError shouldThrow={true} />
      </div>
    );

    const screen = render(
      <ErrorBoundary>
        <div>
          <NestedComponent />
        </div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Uh oh!")).toBeDefined();
  });

  test("does not catch errors in event handlers", () => {
    const ComponentWithEventHandler = () => {
      const handleClick = () => {
        throw new Error("Event handler error");
      };

      return <button onClick={handleClick}>Click me</button>;
    };

    const screen = render(
      <ErrorBoundary>
        <ComponentWithEventHandler />
      </ErrorBoundary>,
    );

    // Component should render normally
    expect(screen.getByText("Click me")).toBeDefined();
    expect(screen.queryByText("Uh oh!")).toBeNull();
  });

  test("resets error state when navigating away", () => {
    let setThrowError;
    const ToggleError = () => {
      const [shouldThrow, setShouldThrow] = React.useState(false);
      setThrowError = setShouldThrow;
      return <ThrowError shouldThrow={shouldThrow} />;
    };

    const screen = render(
      <ErrorBoundary>
        <ToggleError />
      </ErrorBoundary>,
    );

    // Initially no error
    expect(screen.getByText("No error")).toBeDefined();

    // Trigger error
    setThrowError(true);
    screen.rerender(
      <ErrorBoundary>
        <ToggleError />
      </ErrorBoundary>,
    );

    // Error UI should be shown
    expect(screen.getByText("Uh oh!")).toBeDefined();
  });
});
