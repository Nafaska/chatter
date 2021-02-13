import { screen, render } from "@testing-library/react";
import ChatMessage from "./ChatMessage";

const fakeMessageContent = {
  data: {
    message: "it is a test",
    username: "Viktoriia Kovalenko",
    channel: "General",
    time: 1613048680105,
  },
};

test("rendering message from sender", () => {
  render(<ChatMessage data={fakeMessageContent.data} isOwn={false} />);

  expect(screen.getByTestId("username").textContent).toBe(
    "Viktoriia Kovalenko"
  );

  expect(screen.getByTestId("message").textContent).toBe("it is a test");

  expect(
    screen.getByTestId("username").classList.contains("text-blue-700")
  ).toBe(false);

  expect(screen.getByTestId("time").textContent).toBe(
    new Date(1613048680105).toLocaleString()
  );
});

test("rendering owns message", () => {
  render(<ChatMessage data={fakeMessageContent.data} isOwn={true} />);

  expect(screen.getByTestId("isOwnUsername").textContent).toBe(
    "Viktoriia Kovalenko"
  );

  expect(screen.getByTestId("message").textContent).toBe("it is a test");

  expect(
    screen.getByTestId("isOwnUsername").classList.contains("text-blue-700")
  ).toBe(true);

  expect(screen.getByTestId("time").textContent).toBe(
    new Date(1613048680105).toLocaleString()
  );
});
