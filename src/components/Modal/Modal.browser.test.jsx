import { render } from "vitest-browser-react";
import { expect, test, describe, beforeEach, afterEach } from "vitest";
import Modal from "./Modal";

describe("Modal", () => {
  let modalRoot;

  beforeEach(() => {
    // Create a modal root element for the portal to attach to
    modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal");
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    // Clean up the modal root after each test
    if (modalRoot && document.body.contains(modalRoot)) {
      document.body.removeChild(modalRoot);
    }
  });

  test("renders children inside modal portal", async () => {
    const testContent = "Test modal content";
    const screen = render(
      <Modal>
        <p>{testContent}</p>
      </Modal>,
    );

    await expect.element(screen.getByText(testContent)).toBeInTheDocument();
  });

  test("creates modal div with correct class", async () => {
    render(
      <Modal>
        <div>Content</div>
      </Modal>,
    );

    const modalDiv = modalRoot.querySelector(".modal");
    await expect.element(modalDiv).toBeInTheDocument();
    await expect.element(modalDiv).toHaveClass("modal");
  });

  test("renders content inside the modal root element", async () => {
    const testContent = "Portal test content";
    render(
      <Modal>
        <span data-testid="modal-content">{testContent}</span>
      </Modal>,
    );

    // Verify the content is inside the modal root
    const modalContent = modalRoot.querySelector(
      '[data-testid="modal-content"]',
    );
    await expect.element(modalContent).toBeInTheDocument();
    await expect.element(modalContent).toHaveTextContent(testContent);
  });

  test("handles complex children components", async () => {
    const ComplexChild = () => (
      <div>
        <h2>Modal Title</h2>
        <p>Modal description</p>
        <button>Close</button>
      </div>
    );

    const screen = render(
      <Modal>
        <ComplexChild />
      </Modal>,
    );

    await expect.element(screen.getByText("Modal Title")).toBeInTheDocument();
    await expect
      .element(screen.getByText("Modal description"))
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: "Close" }))
      .toBeInTheDocument();
  });

  test("handles multiple children", async () => {
    const screen = render(
      <Modal>
        <h1>First child</h1>
        <p>Second child</p>
        <button>Third child</button>
      </Modal>,
    );

    await expect.element(screen.getByText("First child")).toBeInTheDocument();
    await expect.element(screen.getByText("Second child")).toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: "Third child" }))
      .toBeInTheDocument();
  });

  test("cleans up DOM element on unmount", async () => {
    const { unmount } = render(
      <Modal>
        <div data-testid="cleanup-test">Content</div>
      </Modal>,
    );

    // Verify content exists initially
    const initialContent = modalRoot.querySelector(
      '[data-testid="cleanup-test"]',
    );
    await expect.element(initialContent).toBeInTheDocument();

    // Unmount and verify cleanup
    unmount();

    // After unmount, the modal div should be removed from modal root
    const afterUnmount = modalRoot.querySelector(
      '[data-testid="cleanup-test"]',
    );
    expect(afterUnmount).toBeNull();
  });

  test("handles empty children", async () => {
    render(<Modal>{null}</Modal>);

    const modalDiv = modalRoot.querySelector(".modal");
    await expect.element(modalDiv).toBeInTheDocument();
    await expect.element(modalDiv).toBeEmptyDOMElement();
  });

  test("handles string children", async () => {
    const stringContent = "Simple string content";
    const screen = render(<Modal>{stringContent}</Modal>);

    await expect.element(screen.getByText(stringContent)).toBeInTheDocument();
  });

  test("supports multiple modal instances", async () => {
    const screen1 = render(
      <Modal>
        <div data-testid="modal-1">First modal</div>
      </Modal>,
    );

    const screen2 = render(
      <Modal>
        <div data-testid="modal-2">Second modal</div>
      </Modal>,
    );

    // Both modals should be present
    await expect.element(screen1.getByTestId("modal-1")).toBeInTheDocument();
    await expect.element(screen2.getByTestId("modal-2")).toBeInTheDocument();

    // Both should be attached to the same modal root
    const modal1 = modalRoot.querySelector('[data-testid="modal-1"]');
    const modal2 = modalRoot.querySelector('[data-testid="modal-2"]');

    await expect.element(modal1).toBeInTheDocument();
    await expect.element(modal2).toBeInTheDocument();
  });

  test("preserves event handlers on children", async () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    const screen = render(
      <Modal>
        <button onClick={handleClick}>Click me</button>
      </Modal>,
    );

    const button = screen.getByRole("button", { name: "Click me" });
    await button.click();

    expect(clicked).toBe(true);
  });

  test("maintains DOM structure integrity", async () => {
    render(
      <Modal>
        <div className="modal-content">
          <header className="modal-header">Header</header>
          <main className="modal-body">Body</main>
          <footer className="modal-footer">Footer</footer>
        </div>
      </Modal>,
    );

    // Verify the structure is maintained within the modal
    const modalContent = modalRoot.querySelector(".modal-content");
    const header = modalRoot.querySelector(".modal-header");
    const body = modalRoot.querySelector(".modal-body");
    const footer = modalRoot.querySelector(".modal-footer");

    await expect.element(modalContent).toBeInTheDocument();
    await expect.element(header).toBeInTheDocument();
    await expect.element(body).toBeInTheDocument();
    await expect.element(footer).toBeInTheDocument();

    // Verify nesting structure
    expect(modalContent.contains(header)).toBe(true);
    expect(modalContent.contains(body)).toBe(true);
    expect(modalContent.contains(footer)).toBe(true);
  });

  test("handles dynamic content updates", async () => {
    let content = "Initial content";

    const DynamicContent = () => <div>{content}</div>;

    const screen = render(
      <Modal>
        <DynamicContent />
      </Modal>,
    );

    await expect
      .element(screen.getByText("Initial content"))
      .toBeInTheDocument();

    // Update content
    content = "Updated content";
    screen.rerender(
      <Modal>
        <DynamicContent />
      </Modal>,
    );

    await expect
      .element(screen.getByText("Updated content"))
      .toBeInTheDocument();
  });
});
