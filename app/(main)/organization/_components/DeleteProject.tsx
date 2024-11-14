"use client";
import { deleteProject } from "@/actions/project";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { useOrganization } from "@clerk/nextjs";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const DeleteProject = ({ projectId }: { projectId: string }) => {
    const { membership } = useOrganization();

    const isAdmin = membership?.role === "org:admin";

    const router = useRouter();

    const {
        data: deleted,
        loading,
        error,
        fn: deleteProjectFn,
    } = useFetch(deleteProject);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            deleteProjectFn(projectId);
        }
    };

    useEffect(() => {
        if (deleted?.success) {
            toast.success("Project deleted")
            router.refresh();

        }
    });

    if (!isAdmin) return null;
    return (
        <>
            <Button
                className={`${loading ? "animate-pulse" : ""}`}
                size="sm"
                onClick={handleDelete}
            >
                <TrashIcon className="size-4" />
            </Button>
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </>
    );
};

export default DeleteProject;
