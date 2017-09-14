import { createArenaStore } from "redux-arena";

export default function configureStore() {
  const store = createArenaStore();
  return store;
}
