import React from "react";

interface SprintBoardProps<Type> {
    sprints: Array<Type>;
    projectId: string;
    orgId: string;
}

const SprintBoard = <Type extends unknown>({
    sprints,
    projectId,
    orgId,
}: SprintBoardProps<Type>) => {
    return <div>SprintBoard</div>;
};

export default SprintBoard;
