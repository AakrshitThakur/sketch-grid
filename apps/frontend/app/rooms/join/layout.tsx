import { Suspense } from "react";
import JoinRoom from "./page";

// Using Suspense because the child use useSearchParam which can take some time to load
export default function JoinRoomLayout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JoinRoom />
    </Suspense>
  );
}
