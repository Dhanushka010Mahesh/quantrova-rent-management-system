import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import PageContainer from "../../layout/PageContainer";

export default function GRNEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO:
    // GET /api/grns/:id

    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, [id]);

  if (loading) {
    return (
      <PageContainer
        title="Edit GRN"
        breadcrumbs={[
          { label: "Purchasing" },
          {
            label: "GRN",
            path: "/admin/purchasing/grn",
          },
          { label: "Edit" },
        ]}
      >
        <div className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
          Loading GRN...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Edit GRN"
      subtitle={`Update ${id}`}
      breadcrumbs={[
        { label: "Purchasing" },
        {
          label: "GRN",
          path: "/admin/purchasing/grn",
        },
        { label: "Edit" },
      ]}
      actions={
        <button
          onClick={() =>
            navigate("/admin/purchasing/grn")
          }
          className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-secondary hover:bg-background"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      }
    >
      {/* 
        මෙතන GRNForm component එක use කරන්න.

        <GRNForm
          mode="edit"
          grn={grn}
          onSaved={() =>
            navigate("/admin/purchasing/grn")
          }
        />
      */}

      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="text-sm text-text-muted">
          GRN edit form goes here.
        </p>

        <button
          className="mt-4 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-secondary"
        >
          <Save className="h-4 w-4" />
          Update GRN
        </button>
      </div>
    </PageContainer>
  );
}