"use client";

// Next import
import { useEffect, useState } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import OrgSwitcher from "@/components/OrgSwitcher";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Custom import
import { Project, projectSchema } from "@/lib/schemas";
import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";

import FormTextarea from "@/components/FormTextarea";
import useFetch from "@/hooks/use-fetch";
import { createProject } from "@/actions/project";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateProjectPage = () => {
    const { isLoaded: isOrgLoaded, membership } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();

    // State
    const [isAdmin, setIsAdmin] = useState(false);

    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<Project>({
        resolver: zodResolver(projectSchema),
        mode: "onSubmit",
    });

    const {
        data: project,
        loading,
        error,
        fn: createProjectFn,
    } = useFetch(createProject);

    useEffect(() => {
        if (project) {
            toast.success("Project created successfully");
            router.push(`/project/${project.id}`);
        }
    });

    // Update the submit handler type to use Project
    const onSubmit: SubmitHandler<Project> = async (data) => {
        if (!isAdmin) {
            alert("Only organization admins can create projects");
            return;
        }
        await createProjectFn(data);
    };

    useEffect(() => {
        if (isOrgLoaded && isUserLoaded && membership) {
            setIsAdmin(membership.role === "org:admin");
        }
    }, [isOrgLoaded, membership, isUserLoaded]);

    if (!isOrgLoaded || !isUserLoaded) {
        return null;
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col gap-2 items-center">
                <span className="text-2xl gradient-title">
                    Oops! Only Admins can create project
                </span>
                <OrgSwitcher />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-5xl text-center font-bold mb-8  gradient-title">
                Create New Project
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                    name="name" // Adjusted to match Project type field name
                    control={control}
                    placeholder="Project Name"
                    error={errors.name}
                />
                <FormInput
                    name="key" // Adjusted to match Project type field name
                    control={control}
                    placeholder="Project Key (Ex: RCYT)"
                    error={errors.name}
                />
                <FormTextarea
                    name="description"
                    control={control}
                    placeholder="Project Description"
                    error={errors.name}
                />
                <Button
                    disabled={loading}
                    size="lg"
                    className="w-full"
                    type="submit"
                >
                    {loading ? "Creating..." : "Create Project"}
                </Button>
                {error && <p className="text-red-500 mt-2">{error.message}</p>}
            </form>
        </div>
    );
};

export default CreateProjectPage;
