"use client";

// React & lib import
import React, { useEffect, useState } from "react";
import { Sprint } from "@prisma/client";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

// Custom import
import SprintManager from "./SprintManager";
import statuses from "@/data/status.json";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateIssueDrawer from "./CreateIssueDrawer";
import useFetch from "@/hooks/use-fetch";
import { getIssuesForSprint } from "@/actions/issue";
import { BarLoader } from "react-spinners";
import IssueCard from "@/components/IssueCard";

export type SprintBoardProps<Type = Sprint> = {
    sprints: Type[];
    projectId: string;
    orgId: string;
};

const SprintBoard = ({ sprints, projectId, orgId }: SprintBoardProps) => {
    const [currentSprint, setCurrentSprint] = useState<Sprint | undefined>(
        sprints.find((spr) => spr?.status === "ACTIVE") || sprints[0]
    );

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<null | string>(null);

    const handleAddIssue = (status: null | string) => {
        setSelectedStatus(status);
        setIsDrawerOpen(true);
    };

    // fetch issue for sprint
    const {
        fn: fetchIssues,
        data: issues,
        loading: issueLoading,
        setData: setIssues,
        error: issuesError,
    } = useFetch(getIssuesForSprint);

    useEffect(() => {
        if (currentSprint?.id) {
            fetchIssues(currentSprint?.id);
        }
    }, [currentSprint?.id]);
    const [filteredIssues, setFilteredIssues] = useState(issues);

    // Create Issue function
    const handleIssueCreated = () => {
        // fetch issues again
        fetchIssues(currentSprint?.id);
    };
    // Drag handler
    const onDragEnd = () => {};

    if (issuesError) return <div>Error Loading issues</div>;

    return (
        <div>
            {/* Sprint Manager */}
            <SprintManager
                sprint={currentSprint}
                setSprint={setCurrentSprint}
                sprints={sprints}
                projectId={projectId}
            />
            {issueLoading && (
                <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />
            )}
            {/* Kanban board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 bg-slate-900 p-4 rounded-lg">
                    {statuses.map((status) => {
                        return (
                            <Droppable
                                key={status.key}
                                droppableId={status.key}
                            >
                                {(provided) => {
                                    return (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="space-y-2"
                                        >
                                            <h3 className="font-semibold mb-2 text-center">
                                                {status.name}
                                            </h3>
                                            {/* Issues */}

                                            {issues
                                                ?.filter(
                                                    (issue) =>
                                                        issue.status ===
                                                        status.key
                                                )
                                                .map((issue, index) => (
                                                    <Draggable
                                                        key={issue.id}
                                                        index={index}
                                                        draggableId={issue.id}
                                                    >
                                                        {(provided) => {
                                                            return (
                                                                <div
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <IssueCard issue={issue} />
                                                                </div>
                                                            );
                                                        }}
                                                    </Draggable>
                                                ))}
                                            {provided.placeholder}
                                            {status.key === "TODO" &&
                                                currentSprint.status !==
                                                    "COMPLETED" && (
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full"
                                                        onClick={() =>
                                                            handleAddIssue(
                                                                status.key
                                                            )
                                                        }
                                                    >
                                                        <Plus className="mr-2 size-4" />
                                                        Create Issue
                                                    </Button>
                                                )}
                                        </div>
                                    );
                                }}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>
            <CreateIssueDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sprintId={currentSprint.id}
                status={selectedStatus}
                projectId={projectId}
                onIssueCreate={handleIssueCreated}
                orgId={orgId}
            />
        </div>
    );
};

export default SprintBoard;
