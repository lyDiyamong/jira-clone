import React from "react";
import { SprintBoardProps } from "./SprintBoard";

type SprintManagerProps = {
    sprint : {
        status : string
    }
    setSprint: void
} | SprintBoardProps<Type>

const SprintManager = ({ sprints, projectId, sprint, setSprint }) => {
    return <div>SprintManager</div>;
};

export default SprintManager;
