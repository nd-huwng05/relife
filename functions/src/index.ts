import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/v2";

initializeApp();

// Every function runs in Singapore, the closest region to Vietnam (Notion: 3. Backend).
setGlobalOptions({ region: "asia-southeast1" });

// Export every function here as it is written (first one: publishBag in S2).
export {};
