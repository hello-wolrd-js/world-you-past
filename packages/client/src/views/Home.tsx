import { Component } from "solid-js";
import { MapContainer } from "@/components/map/Map";

export const HomeView: Component = () => {
    return (
        <div class="w-full h-full">
            <MapContainer />
        </div>
    );
};
