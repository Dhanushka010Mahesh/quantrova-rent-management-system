import { useNavigate } from "react-router-dom";
import { Home, SearchX } from "lucide-react";
import Button from "../../components/ui/button/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/15 text-primary-dark">
        <SearchX className="h-10 w-10" />
      </div>

      <h1 className="mt-6 text-5xl font-bold text-secondary">404</h1>
      <p className="mt-2 text-lg font-semibold text-secondary">Page Not Found</p>
      <p className="mt-1 max-w-sm text-sm text-text-muted">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <Button icon={<Home className="h-4 w-4" />} onClick={() => navigate("/admin/dashboard")} className="mt-6">
        Back to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;