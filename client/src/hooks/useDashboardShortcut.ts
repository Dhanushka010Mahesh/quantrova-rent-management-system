import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DASHBOARD_PATH = "/admin/dashboard";

/**
 * Global shortcut: Alt + D navigates to the dashboard from anywhere in the app.
 * Ignored while the user is typing in an input, textarea, select, or a
 * contentEditable element so it doesn't interfere with normal typing.
 */
export function useDashboardShortcut() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (isTyping) return;

      // Alt + D
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        navigate(DASHBOARD_PATH);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);
}
// Alt + D for navigate to Dashboard