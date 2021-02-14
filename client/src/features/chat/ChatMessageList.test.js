import { screen, render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ChatMessageList from "./ChatMessageList";
import TestRenderer from "react-test-renderer";
import { storeMessages, openChat } from "./chatSlice";
import { configureStore as realConfigureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authSlice";
import chatReducer, { LIMIT_OF_MESSAGES } from "./chatSlice";

let store;

beforeEach(() => {
  store = realConfigureStore({
    reducer: {
      auth: authReducer,
      chat: chatReducer,
    },
  });
});

let messages = [];

for (let i = 0; i < LIMIT_OF_MESSAGES; i++) {
  messages.push({
    data: {
      message: `#${i} message`,
      username: `user${i}`,
      channel: "ChecksLimit",
      time: 1613048699105,
    },
  });
}

describe("dispatching content:", () => {
  test("limit messages per channel", () => {
    render(
      <Provider store={store}>
        <ChatMessageList />
      </Provider>
    );
    store.dispatch(openChat({ name: "ChecksLimit", description: "" }));
    messages.map((message) => store.dispatch(storeMessages(message)));
    expect(screen.getByTestId("channel-content").children).toHaveLength(16);
    store.dispatch(
      storeMessages({
        data: {
          message: "it's a message above the limit",
          username: "Shelby",
          channel: "ChecksLimit",
          time: 1613048699105,
        },
      })
    );
    expect(screen.getByTestId("channel-content").children).toHaveLength(16);
    expect(document.body).toMatchSnapshot();
  });

  test("dispatching a new message to existed one", () => {
    render(
      <Provider store={store}>
        <ChatMessageList />
      </Provider>
    );
    store.dispatch(openChat({ name: "General", description: "" }));
    store.dispatch(
      storeMessages({
        data: {
          message: "1st message",
          username: "Viktoriia Kovalenko",
          channel: "General",
          time: 1613048680105,
        },
      })
    );
    store.dispatch(
      storeMessages({
        data: {
          message: "2nd message",
          username: "Shelby",
          channel: "General",
          time: 1613048699105,
        },
      })
    );
    expect(screen.getByTestId("channel-content").children).toHaveLength(3);
    expect(document.body).toMatchSnapshot();
  });

  test("rendering component without messages", () => {
    render(
      <Provider store={store}>
        <ChatMessageList />
      </Provider>
    );
    store.dispatch(openChat({ name: "General", description: "" }));
    expect(screen.getByTestId("channel-content").textContent).toBe("");
  });
});

describe("rendering content from mocked store:", () => {
  const mockStore = configureStore([]);
  let mockedStore;
  let comp;
  beforeEach(() => {
    mockedStore = mockStore({
      chat: {
        name: "MyChannel",
        channelsContent: {
          MyChannel: {
            0: {
              message: "it is a test",
              time: 1612982540145,
              username: "Viktoriia Kovalenko",
              name: "General",
            },
            1: {
              message: "works fine",
              time: 1612982604222,
              username: "Shelby",
              name: "General",
            },
          },
        },
      },
      auth: {
        username: "Viktoria Kovalenko",
      },
    });

    mockedStore.dispatch = jest.fn();

    comp = TestRenderer.create(
      <Provider store={mockedStore}>
        <ChatMessageList />
      </Provider>
    );
  });
  test("rendering page with 2 messages", () => {
    expect(comp).toMatchSnapshot();
  });
});
