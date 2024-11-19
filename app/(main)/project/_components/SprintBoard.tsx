"use client";

// React & lib import
import React, { useState } from "react";
import { Sprint } from "@prisma/client";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

// Custom import
import SprintManager from "./SprintManager";
import statuses from "@/data/status.json";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateIssueDrawer from "./CreateIssueDrawer";

export type SprintBoardProps<Type = Sprint> = {
    sprints: Type[];
    projectId: string;
    orgId: string;
};

const SprintBoard = ({ sprints, projectId, orgId }: SprintBoardProps) => {
    const [currentSprint, setCurrentSprint] = useState(
        sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
    );

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<null | string>(null);

    const handleAddIssue = (status) => {
        setSelectedStatus(status);
        setIsDrawerOpen(true);
    };

    // Create Issue function
    const handleIssueCreate = () => {

    }

    // Drag handler
    const onDragEnd = () => {};

    return (
        <div>
            {/* Sprint Manager */}
            <SprintManager
                sprint={currentSprint}
                setSprint={setCurrentSprint}
                sprints={sprints}
                projectId={projectId}
            />
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
                                            {provided.placeholder}
                                            {status.key === "TODO" &&
                                                currentSprint.status !==
                                                    "COMPLETED" && (
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full"
                                                        onClick={handleAddIssue}
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
                onIssueCreate={handleIssueCreate}
                orgId={orgId}
            />
        </div>
    );
};

export default SprintBoard;
