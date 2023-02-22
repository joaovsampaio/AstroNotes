import { create } from "zustand";
import { User } from "firebase/auth";
import { MissionType } from "../screens/MissionRegister";

type MissionListState = {
  missionList: MissionType[];
  setMissionList: (mission: any) => void;
};

export const useMissionList = create<MissionListState>((set) => ({
  missionList: [],
  setMissionList: (mission: any) =>
    set((state) => ({
      missionList: (state.missionList = mission),
    })),
}));

type UserAccount = {
  userAccount: User | null;
  setUserAccount: (user: any) => void;
};

export const useUserAccount = create<UserAccount>((set) => ({
  userAccount: null,
  setUserAccount: (user: any) =>
    set((state) => ({
      userAccount: (state.userAccount = user),
    })),
}));
