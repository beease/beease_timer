import React, { useEffect, useState } from "react";
import { WorkspaceList, User } from "../../libs/interfaces";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
} from "chart.js";
import { trpc } from "../../trpc";
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
  const [users, setUsers] = useState<User[]>([]);
  const [selectedMode, setSelectedMode] = useState<"day" | "week" | "month">(
    "day"
  );
  const [selectedUserId, setSelectedUserId] = useState("");
  const [dataToDisplay, setDataToDisplay] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      tension: number;
    }[];
  }>({ labels: [], datasets: [] });
  const [dataPerParams, setDataPerParams] = useState<
    Array<{
      day: string;
      projectId: string;
      time: number;
      price: number;
    }>
  >([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const getTimeBetween = (startedAt: string, endedAt: string) => {
    const startedAtDate = new Date(startedAt);
    const endedAtDate = new Date(endedAt);
    const timeBetween = endedAtDate.getTime() - startedAtDate.getTime();

    return timeBetween;
  };

  const allUsers = () => {
    const allUsers: User[] = [];
    workspace.projects.forEach((project) => {
      project.memberSessions.forEach((memberSession) => {
        if (
          memberSession.memberWorkspace?.user &&
          !allUsers.find(
            (user) => user.id === memberSession.memberWorkspace?.user.id
          )
        ) {
          allUsers.push(memberSession.memberWorkspace.user);
        }
      });
    });
    setUsers(allUsers);
  };

  const getDataByTime = () => {
    let totalTime = 0;
    let totalPrice = 0;
    workspace.projects.forEach((project) => {
      project.memberSessions.forEach((memberSession) => {
        if (memberSession.endedAt) {
          const time = getTimeBetween(
            memberSession.startedAt,
            memberSession.endedAt
          );
          totalTime += time;
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

  const getDataByParams = () => {
    function formatDate(date: string) {
      const d = new Date(date);
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    }

    if (selectedUserId !== "") {
      let startDate: Date, endDate: Date;

      switch (selectedMode) {
        case "day": {
          startDate = new Date(
            new Date(selectedDate.setUTCHours(0)).setUTCMinutes(0)
          );
          endDate = new Date(
            new Date(selectedDate.setUTCHours(23)).setUTCMinutes(59)
          );
          break;
        }
        case "week":
          startDate = new Date(
            selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay())
          );
          endDate = new Date(
            selectedDate.setDate(
              selectedDate.getDate() - selectedDate.getDay() + 6
            )
          );
          break;
        case "month":
          startDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            1
          );
          endDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth() + 1,
            0
          );
          break;
      }

      const aggregatedTimeData: any = {};

      workspace.projects.forEach((project) => {
        project.memberSessions.forEach((memberSession) => {
          if (
            memberSession.endedAt &&
            new Date(memberSession.startedAt) >= startDate &&
            new Date(memberSession.endedAt) <= endDate
          ) {
            const time = getTimeBetween(
              memberSession.startedAt,
              memberSession.endedAt
            );
            const hourByDay = new Date(time).getUTCHours();
            const day = formatDate(memberSession.startedAt);

            if (memberSession.memberWorkspace?.user.id === selectedUserId) {
              const projectId = memberSession.projectId!;

              if (!aggregatedTimeData[day]) {
                aggregatedTimeData[day] = {};
              }

              if (!aggregatedTimeData[day][projectId]) {
                aggregatedTimeData[day][projectId] = { time: 0, price: 0 };
              }

              aggregatedTimeData[day][projectId].time += hourByDay;
              aggregatedTimeData[day][projectId].price += project.dailyPrice
                ? hourByDay * project.dailyPrice
                : 0;
            }
          }
        });
      });

      const dataByParams: Array<{
        day: string;
        projectId: string;
        time: number;
        price: number;
      }> = [];

      for (const day in aggregatedTimeData) {
        for (const projectId in aggregatedTimeData[day]) {
          dataByParams.push({
            day,
            projectId,
            time: aggregatedTimeData[day][projectId].time,
            price: aggregatedTimeData[day][projectId].price,
          });
        }
      }
      setDataPerParams(dataByParams);
    }
  };

  const getData = () => {
    const dataArray: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        fill: boolean;
        borderColor: string;
        tension: number;
      }[];
    } = {
      labels: [],
      datasets: [
        { label: "", data: [], fill: false, borderColor: "", tension: 0 },
      ],
    };
    dataPerParams.forEach((dataPerParam) =>
      dataPerParam.projectId === selectedProjectId
        ? dataArray.labels.push(dataPerParam.day) &&
          dataArray.labels.push(dataPerParam.day)
        : null
    );
    dataPerParams.forEach((dataPerParam) =>
      dataPerParam.projectId === selectedProjectId
        ? dataArray.datasets[0].data.push(dataPerParam.time)
        : null
    );
    console.log("data to display : ", dataToDisplay, dataPerParams);
    setDataToDisplay(dataArray);
  };

  console.log("data per params :", dataPerParams);

  useEffect(() => {
    getData();
  }, [dataPerParams]);
  useEffect(() => {
    getDataByParams();
  }, [selectedMode, selectedDate, selectedUserId, selectedProjectId]);
  useEffect(() => {
    getDataByTime();
  }, [workspace]);
  useEffect(() => {
    allUsers();
  }, []);

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

          <select
            name="Sélection d'un utilisateur"
            id='project-selector'
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value=''>Sélectionner un utilisateur</option>
            {users.map((user) => (
              <option value={user.id}>{user.name}</option>
            ))}
          </select>
          <select
            name="Sélection d'un mode"
            id='project-selector'
            onChange={(e) =>
              setSelectedMode(e.target.value as "day" | "week" | "month")
            }
          >
            <option value='day'>Jour</option>

            {[
              { label: "Semaine", mode: "week" },
              { label: "Mois", mode: "month" },
            ].map((selectMode) => (
              <option value={selectMode.mode}>{selectMode.label}</option>
            ))}
          </select>
          <Line data={dataToDisplay} />
        </div>
      </div>
    </div>
  );
};
