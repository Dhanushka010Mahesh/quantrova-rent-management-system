import { useNavigate } from "react-router-dom";
import { Home, ShieldAlert } from "lucide-react";
import Button from "../../components/ui/button/Button";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-danger/15 text-danger">
        <ShieldAlert className="h-10 w-10" />
      </div>

      <h1 className="mt-6 text-5xl font-bold text-secondary">403</h1>
      <p className="mt-2 text-lg font-semibold text-secondary">Access Denied</p>
      <p className="mt-1 max-w-sm text-sm text-text-muted">
        You don't have permission to view this page. Contact an admin if you think this is a mistake.
      </p>

      <Button icon={<Home className="h-4 w-4" />} onClick={() => navigate("/admin/dashboard")} className="mt-6">
        Back to Dashboard
      </Button>
    </div>
  );
};

export default Unauthorized;