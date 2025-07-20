import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/vitest';
import { test, vi, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AddTaskDialog } from '../../components/AddTaskDialog';


// Mock API Actions
vi.mock("@/actions/todoActions", () => ({
  createTodoAction: vi.fn(() => Promise.reject(new Error("API Error"))),
  updateTodoAction: vi.fn(() => Promise.reject(new Error("API Error"))),
}));

// Helper render with React Query
function renderWithQuery(component: React.ReactNode) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
}

test("Dialog stays open and shows error if API call fails", async () => {
  renderWithQuery(<AddTaskDialog open={true} onOpenChange={() => {}} userId="test-user-id" />);

  // افتح المودال
  const openButton = screen.getByRole("button", { name: /add task/i });
  fireEvent.click(openButton);

  // املى البيانات
  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "My task" } });

  // دوس Submit
  const submitButton = screen.getByRole("button", { name: /save/i });
  fireEvent.click(submitButton);

  // انتظر لحد ما الخطأ يبان
  await waitFor(() => {
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/API Error/i)).toBeInTheDocument();
  });
});
