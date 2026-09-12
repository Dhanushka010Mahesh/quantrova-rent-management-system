import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "app-fullscreen-preference";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [wantsFullscreen, setWantsFullscreen] = useState(sessionStorage.getItem(STORAGE_KEY) === "1");

  useEffect(() => {
    const onChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      // If the browser kicked us out of fullscreen (e.g. Esc key), respect that
      // and don't keep nagging — but keep the stored preference for the resume prompt.
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // On mount (including after a refresh), try to silently restore fullscreen
  // if the user had it on before. Browsers usually block this without a fresh
  // user gesture, so this will succeed on some browsers/settings and silently
  // fail on others — the "Resume Fullscreen" prompt covers the fallback case.
  useEffect(() => {
    if (wantsFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Blocked by the browser — user will see the resume prompt instead.
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      sessionStorage.setItem(STORAGE_KEY, "1");
      setWantsFullscreen(true);
    } catch {
      // ignore — some browsers/iframes may refuse
    }
  }, []);

  const exit = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } finally {
      sessionStorage.removeItem(STORAGE_KEY);
      setWantsFullscreen(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      exit();
    } else {
      enter();
    }
  }, [enter, exit]);

  // True when the user wanted fullscreen (e.g. right after a refresh) but the
  // browser is currently not in fullscreen — show a "tap to resume" prompt.
  const needsResume = wantsFullscreen && !isFullscreen;

  return { isFullscreen, needsResume, enter, exit, toggle };
}