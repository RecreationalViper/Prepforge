import { Suspense } from "react";
import DiscoverView from "./DiscoverView";
export const metadata = { title: "Discover" };
export default function Page() { return <Suspense fallback={null}><DiscoverView /></Suspense>; }
