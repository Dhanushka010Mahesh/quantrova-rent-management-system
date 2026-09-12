import { useEffect } from "react";

const APP_NAME = "YourBrand Admin";

/**
 * Sets the browser tab title (<title> inside <head>) for the current page.
 * Usage: <PageTitle title="Customers" />  ->  tab shows "Customers · YourBrand Admin"
 */
export default function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
    return () => {
      document.title = previous;
    };
  }, [title]);

  return null;
}