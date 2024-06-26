import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, assert } from "vitest";
import { TodoList } from "./TodoList";

afterEach(cleanup);

describe("TodoList Component", () => {
  it("renders the TodoList component", () => {
    render(<TodoList />);
    assert(screen.getByText(/todo list/i));
  });

  it("adds a new todo item", () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText(/add new todo/i);
    const addButton = screen.getByText(/add/i);

    fireEvent.change(input, { target: { value: "New Todo" } });
    fireEvent.click(addButton);

    assert(screen.getByText("New Todo"));
  });

  it("removes a todo item", () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText(/add new todo/i);
    const addButton = screen.getByText(/add/i);

    fireEvent.change(input, { target: { value: "Todo to be removed" } });
    fireEvent.click(addButton);

    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);

    assert(!screen.queryByText("Todo to be removed"));
  });

  it("marks a todo item as completed", () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText(/add new todo/i);
    const addButton = screen.getByText(/add/i);

    fireEvent.change(input, { target: { value: "Todo to be completed" } });
    fireEvent.click(addButton);

    const completeButton = screen.getByText("Complete");
    fireEvent.click(completeButton);

    assert(
      screen.getByText("Todo to be completed").classList.contains("completed")
    );
  });

  it("filters todo items", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText(/add new todo/i);
    const addButton = screen.getByText(/add/i);

    // Adding multiple todos
    fireEvent.change(input, { target: { value: "Active Todo" } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: "Completed Todo" } });
    fireEvent.click(addButton);

    const completeButton = screen.getAllByText("Complete")[1];
    fireEvent.click(completeButton);

    // Filter by active
    const activeFilterButton = screen.getByText("Active");
    fireEvent.click(activeFilterButton);

    assert.equal(screen.getAllByText("Active Todo").length, 1);
    // Filter by completed
    const completedFilterButton = screen.getByText("Completed");
    fireEvent.click(completedFilterButton);
    assert(screen.getByText("Completed Todo"));
  });
});
