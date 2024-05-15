import { User } from "@world-you-past/models";
import { createStore } from "solid-js/store";

interface UserStoreState {
    user: User | null;
}

const [store, setStore] = createStore<UserStoreState>({
    user: null,
});

export const useUserStore = () => {
    return {
        state: store,
        setStore,
    };
};
