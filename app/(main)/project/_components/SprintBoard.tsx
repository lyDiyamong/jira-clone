"use client";

// React & lib import
import React, { useState } from "react";
import { Sprint } from "@prisma/client";

// Custom import
import SprintManager from "./SprintManager";

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
        </div>
    );
};

export default SprintBoard;
