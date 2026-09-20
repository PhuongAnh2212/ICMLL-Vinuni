"use client";

import { useEffect } from "react";
import { markReady } from "@/lib/loader";

/** Sub-pages have no loader, so release the intro animations as soon as they mount. */
export default function Ready() {
  useEffect(() => {
    markReady();
  }, []);
  return null;
}
