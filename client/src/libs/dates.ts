type memberSessions = {
  id: string;
  memberWorkspace: {
    user: {
      name: string | null;
      id: string;
      given_name: string;
      family_name: string | null;
      picture: string | null;
    };
  } | null;
  startedAt: string;
  endedAt: string | null;
  projectId: string | null;
  memberWorkspaceId: string | null;
}[];
type memberSession = {
  id: string;
  memberWorkspace: {
    user: {
      name: string | null;
      id: string;
      given_name: string;
      family_name: string | null;
      picture: string | null;
    };
  } | null;
  startedAt: string;
  endedAt: string | null;
  projectId: string | null;
  memberWorkspaceId: string | null;
};
type timeSessionsByDay = {
  time: number[];
  labels: string[];
};
type User = {
  name: string | null;
  id: string;
  given_name: string;
  family_name: string | null;
  picture: string | null;
};
export const daysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

export const processHours = (
  startDate: Date,
  endDate: Date,
  timeSessionsByDay: timeSessionsByDay
) => {
  if (endDate.getHours() - startDate.getHours() > 0) {
    for (let i = startDate.getHours(); i <= endDate.getHours(); i++) {
      timeSessionsByDay.time[i] = 3600000;
    }
    if (
      endDate.getTime() - startDate.getTime() > 0 &&
      new Date(endDate.getTime() - startDate.getTime()).getMinutes() > 0
    ) {
      timeSessionsByDay.time[endDate.getHours()] =
        new Date(endDate.getTime() - startDate.getTime()).getMinutes() * 60000;
    }
    return true;
  }
  return false;
};

export const getTimeSessionsByDay = (
  selectedDate: Date,
  sessions: memberSessions,
  selectedUserId: string,
  allUsers: User[]
) => {
  const startDate = new Date(new Date(selectedDate.setHours(0)).setMinutes(0));
  const endDate = new Date(new Date(selectedDate.setHours(23)).setMinutes(59));
  const rangeDate = new Date(startDate);
  rangeDate.setHours(startDate.getHours() + 1);
  const timeSessionsByDay: timeSessionsByDay = {
    time: new Array(24).fill(0),
    labels: [],
  };
  let timeByHour = 0;
  let hasBeenProcessed = false;
  while (startDate <= endDate) {
    sessions.map((session) => {
      if (session.endedAt) {
        const sessionDate = new Date(session.startedAt);
        const sessionEndDate = new Date(session.endedAt);
        if (
          sessionDate >= startDate &&
          sessionEndDate <= rangeDate &&
          session.memberWorkspace?.user?.id === selectedUserId
        ) {
          hasBeenProcessed = processHours(
            new Date(session.startedAt),
            new Date(session.endedAt),
            timeSessionsByDay
          );

          timeByHour += new Date(
            sessionEndDate.getTime() - sessionDate.getTime()
          ).getMinutes();
        }
      }
    });
    if (!hasBeenProcessed) {
      timeSessionsByDay.time[startDate.getHours()] = timeByHour;
    }
    timeSessionsByDay.labels.push(startDate.getHours().toString());
    startDate.setHours(startDate.getHours() + 1);
    rangeDate.setHours(rangeDate.getHours() + 1);
    timeByHour = 0;
  }
  console.log("time by day :", timeSessionsByDay);
  return timeSessionsByDay;
};

export const getTimeSessionsByDayByProject = (
  selectedDate: Date,
  sessions: memberSessions,
  users: User[]
) => {
  const startDate = new Date(new Date(selectedDate.setHours(0)).setMinutes(0));
  const endDate = new Date(new Date(selectedDate.setHours(23)).setMinutes(59));
  const rangeDate = new Date(startDate);
  rangeDate.setHours(startDate.getHours() + 1);
  const timeSessionsByDay: timeSessionsByDay = {
    time: new Array(24).fill(0),
    labels: [],
  };
  let timeByHour = 0;
  const hasBeenProcessed = false;
  while (startDate <= endDate) {
    sessions.map((session) => {
      if (session.endedAt) {
        const sessionDate = new Date(session.startedAt);
        const sessionEndDate = new Date(session.endedAt);
        //   if (
        //     sessionDate >= startDate &&
        //     sessionEndDate <= rangeDate &&
        //     session.memberWorkspace?.user?.id === selectedUserId
        //   ) {
        //     hasBeenProcessed = processHours(
        //       new Date(session.startedAt),
        //       new Date(session.endedAt),
        //       timeSessionsByDay
        //     );

        //     timeByHour += new Date(
        //       sessionEndDate.getTime() - sessionDate.getTime()
        //     ).getMinutes();
        //   }
      }
    });
    if (!hasBeenProcessed) {
      timeSessionsByDay.time[startDate.getHours()] = timeByHour;
    }
    timeSessionsByDay.labels.push(startDate.getHours().toString());
    startDate.setHours(startDate.getHours() + 1);
    rangeDate.setHours(rangeDate.getHours() + 1);
    timeByHour = 0;
  }
  console.log("time by day :", timeSessionsByDay);
  return timeSessionsByDay;
};

// export const getTimeSessionsByWeek = (
//   startDate: Date,
//   endDate: Date,
//   sessions: memberSessions
// ) => {};

// export const getTimeSessionsByMonth = (
//   startDate: Date,
//   endDate: Date,
//   sessions: memberSessions
// ) => {};
