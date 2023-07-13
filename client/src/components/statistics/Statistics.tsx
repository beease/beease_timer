import React, { useEffect, useState } from "react";
import { WorkspaceList } from "../../libs/interfaces";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
} from "chart.js";

interface Props {
  workspace: WorkspaceList;
}

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement
);

export const Statistics = ({ workspace }: Props) => {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const getTimeBetween = (startedAt: string, endedAt: string) => {
    const startedAtDate = new Date(startedAt);
    const endedAtDate = new Date(endedAt);
    const timeBetween = endedAtDate.getTime() - startedAtDate.getTime();

    return timeBetween;
  };
  const getDataByTime = () => {
    let totalTime = 0;
    let totalPrice = 0;
    workspace.projects.forEach((project) => {
      project.memberSessions.forEach((memberSession) => {
        if (memberSession.endedAt) {
          totalTime += getTimeBetween(
            memberSession.startedAt,
            memberSession.endedAt
          );
          if (project.dailyPrice) {
            totalPrice =
              project.dailyPrice *
              new Date(
                getTimeBetween(memberSession.startedAt, memberSession.endedAt)
              ).getUTCHours();
          }
        }
      });
    });
    return {
      totalHours: new Date(totalTime).getUTCHours(),
      totalPrice: totalPrice,
    };
  };
  const getDataByProject = () => {
    if (selectedProjectId !== "") {
      const project = workspace.projects.find(
        (workspaceProject) => workspaceProject.id === selectedProjectId
      );
      console.log("current full project : ", project);
    }
  };

  const data = {
    labels: ["labels", "2", "3", "4", "5", "6", "7"],
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  useEffect(() => {
    getDataByProject();
  }, [selectedProjectId]);
  return (
    <div>
      <div>
        <div>
          <h2>Statistics</h2>
        </div>
        <div>
          <div>
            <p>
              Total :{" "}
              {getDataByTime().totalHours > 24
                ? `jours : ${getDataByTime().totalHours / 24}, heures : ${
                    getDataByTime().totalHours % 24
                  }`
                : `heures : ${getDataByTime().totalHours % 24}`}
            </p>
            <p>Total price : {getDataByTime().totalPrice}</p>
          </div>
          <div>
            <select
              name='Sélection du projet'
              id='project-selector'
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value=''>Sélectionner un projet</option>
              {workspace.projects.map((project) => (
                <option value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <Line data={data} />
        </div>
      </div>
    </div>
  );
};
