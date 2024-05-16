import { User } from "@world-you-past/models";
import { createStore } from "solid-js/store";

interface UserStoreState {
    user: User | null;
}

const _devUser: User = {
    id: "5f4dcc3b5ea9b36f8bb79825",
    avatar: "https://pub-a08fa93d49d347298f3cfbf1f32118b8.r2.dev/usagi.png",
};
const [store, setStore] = createStore<UserStoreState>({
    user: import.meta.env.DEV ? _devUser : (window as any)?.HWJS.getUser(),
});

export const useUserStore = () => {
    return {
        state: store,
        setStore,
    };
};
