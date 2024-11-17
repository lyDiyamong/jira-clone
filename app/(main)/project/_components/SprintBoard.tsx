import React from "react";
import { SprintBoardProps } from "./SprintBoard";

type SprintManagerProps<Type> =
    | {
          sprint: Type;
          setSprint: React.Dispatch<React.SetStateAction<Type>>;
      } & Pick<SprintBoardProps<Type>, "sprints" | "projectId">;

const SprintManager = <Type extends { status: string }>({
    sprint,
    setSprint,
    sprints,
    projectId,
}: SprintManagerProps<Type>) => {
    return <div>SprintManager</div>;
};

export default SprintManager;
