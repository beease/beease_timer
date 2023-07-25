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
import {
  getTimeSessionsByDay,
  getTimeSessionsByDayByProject,
} from "../../libs/dates";
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
  const [dataPerParams, setDataPerParams] = useState<{
    time: number[];
    labels: string[];
  }>();
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

  const getDataFromSessions = () => {
    // Object expected to be returned from getting all sessio by project
    // const dataByProject: {
    //   labels: string[];
    //   usersTime: Array<{
    //     user: string;
    //     time: number[];
    //   }>;
    // } = {
    //   labels: [],
    //   time: [],
    // };
    let dataByUser: {
      labels: string[];
      time: number[];
    } = {
      time: [],
      labels: [],
    };
    switch (selectedMode) {
      case "day": {
        console.log(
          "member sessions : ",
          workspace.projects.find((project) => project.id === selectedProjectId)
            ?.memberSessions
        );
        if (
          selectedProjectId !== "" &&
          workspace.projects.find((project) => project.id === selectedProjectId)
            ?.memberSessions
        ) {
          if (selectedUserId !== "") {
            dataByUser = getTimeSessionsByDay(
              selectedDate,
              workspace.projects.find(
                (project) => project.id === selectedProjectId
              )!.memberSessions,
              selectedUserId,
              users
            );
          }
          // Getting all times by project
          // else {
          //   dataByProject = getTimeSessionsByDayByProject(
          //     selectedDate,
          //     workspace.projects.find(
          //       (project) => project.id === selectedProjectId
          //     )!.memberSessions,
          //     users
          //   );
          // }
        }
        break;
      }
      case "week": {
        break;
      }
      case "month": {
        break;
      }
    }
    setDataPerParams(dataByUser);
  };

  const getData = (byUser: boolean) => {
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
    if (byUser) {
      dataPerParams?.labels.forEach((label) => {
        dataArray.labels.push(label);
      });
      dataPerParams?.time.forEach((sessionTime) => {
        dataArray.datasets[0].data.push(sessionTime);
      });
    }
    console.log("data to display : ", dataArray, dataPerParams);
    setDataToDisplay(dataArray);
  };
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        // Error while defining a max range for time : need to be rectified by minutes/hours/days depending on the selected mode
        // ticks: {
        //   max: 24,
        // },
      },
    },
  };
  useEffect(() => {
    getDataFromSessions();
  }, [selectedMode, selectedDate, selectedUserId, selectedProjectId]);
  useEffect(() => {
    if (dataPerParams && selectedUserId !== "") {
      getData(true);
    } else {
      getData(false);
    }
  }, [dataPerParams]);
  useEffect(() => {
    allUsers();
  }, []);
  console.log("passed data : ", dataToDisplay);
  console.log("selected User : ", selectedUserId);
  return (
    <div>
      <div>
        <div>
          <h2>Statistics</h2>
        </div>
        <div>
          <div>
            {/* <p>
              Total :{" "}
              {getDataByTime().totalHours > 24
                ? `jours : ${getDataByTime().totalHours / 24}, heures : ${
                    getDataByTime().totalHours % 24
                  }`
                : `heures : ${getDataByTime().totalHours % 24}`}
            </p>
            <p>Total price : {getDataByTime().totalPrice}</p> */}
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
            {[
              { label: "Jour", mode: "day" },
              { label: "Semaine", mode: "week" },
              { label: "Mois", mode: "month" },
            ].map((selectMode) => (
              <option value={selectMode.mode}>{selectMode.label}</option>
            ))}
          </select>
          <Line data={dataToDisplay} options={options} />
        </div>
      </div>
    </div>
  );
};
