import { child, get, ref, remove, set, update } from "firebase/database";
import { dataBase } from "../../firebaseConfig";
import { MissionType } from "../screens/MissionRegister";

export const createDbMission = async (
  userId: string | undefined,
  mission: MissionType[]
) => {
  const db = dataBase;
  set(ref(db, "missions/" + userId), {
    mission,
  });
};

export const getDbMission = async (userId: string | undefined) => {
  const dbRef = ref(dataBase);
  return get(child(dbRef, `missions/${userId}/mission`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    }

    return;
  });
};

export const updateDbMission = (
  userId: string | undefined,
  mission: MissionType[]
) => {
  const db = dataBase;

  const postData = {
    mission,
  };

  const updates: any = {};
  updates["missions/" + userId] = postData;

  return update(ref(db), updates);
};

export const deleteDbMissions = async (
  userId: string | undefined,
  mission: MissionType[]
) => {
  const db = dataBase;
  const missionsRef = ref(db, `missions/${userId}/mission`);
  remove(missionsRef);
  return set(ref(db, "missions/" + userId), {
    mission,
  });
};

export const deleteAllDbMissions = async (userId: string | undefined) => {
  const db = dataBase;
  const missionsRef = ref(db, `missions/${userId}/mission`);
  remove(missionsRef);
};
