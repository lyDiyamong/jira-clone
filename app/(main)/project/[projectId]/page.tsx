import { getOneProject } from "@/actions/project";
import { notFound } from "next/navigation";
import React from "react";
import SprintCreationForm from "../_components/SprintCreationForm";
import SprintBoard from "../_components/SprintBoard";

const ProjectDetailPage = async ({
    params,
}: {
    params: { projectId: string };
}) => {
    const { projectId } = await params;

    const project = await getOneProject(projectId);

    if (!project) {
        notFound();
    }
    return (
        <div className="container mx-auto ">
            {/* Sprint Creation */}
            <SprintCreationForm
                projectTitle={project.name}
                projectId={projectId}
                projectKey={project.key}
                sprintKey={project.Sprint?.length + 1}
            />
            {/* Sprint Board */}
            {project.Sprint.length > 0 ? (
                <>
                    <SprintBoard
                        sprints={project.Sprint}
                        projectId={projectId}
                        orgId={project.organizationId}
                    />
                </>
            ) : (
                <div>Create a Sprint from the button above</div>
            )}
        </div>
    );
};

export default ProjectDetailPage;
