import { AvatarOption, AvatarSettings } from "@/types";
import {
  BeardShape,
  AccessoriesShape,
  EyesShape,
  FaceShape,
  Gender,
  SmilesShape,
  HairShape,
  WidgetType,
  WrapperShape,
} from "@/enums";

export const NONE = "none";

export const SCREEN = {
  lg: 976,
} as const;

export const SETTINGS: Readonly<AvatarSettings> = {
  gender: [Gender.Male, Gender.Female],

  wrapperShape: Object.values(WrapperShape),
  faceShape: Object.values(FaceShape),
  hairShape: Object.values(HairShape),
  accessoriesShape: Object.values(AccessoriesShape),
  eyesShape: Object.values(EyesShape),
  smilesShape: Object.values(SmilesShape),
  beardShape: Object.values(BeardShape),

  commonColors: [
    "#6BD9E9",
    "#FC909F",
    "#F4D150",
    "#E0DDFF",
    "#D2EFF3",
    "#FFEDEF",
    "#FFEBA4",
    "#506AF4",
    "#F48150",
    "#48A99A",
    "#C09FFF",
    "#FD6F5D",
    "#000000",
  ],

  skinColors: [
    "#FFE4C0",
    "#F5D7B1",
    "#EFCC9F",
    "#E2BA87",
    "#C99C62",
    "#A47539",
    "#8C5A2B",
    "#643D19",
  ],

  get backgroundColor() {
    return [
      ...this.commonColors,
      "linear-gradient(45deg, #E3648C, #D97567)",
      "linear-gradient(62deg, #8EC5FC, #E0C3FC)",
      "linear-gradient(90deg, #ffecd2, #fcb69f)",
      "linear-gradient(120deg, #a1c4fd, #c2e9fb)",
      "linear-gradient(-135deg, #fccb90, #d57eeb)",
      "transparent",
    ];
  },
};

export const AVATAR_LAYER: Readonly<{
  [key in `${WidgetType}`]: { zIndex: number };
}> = {
  [WidgetType.Face]: {
    zIndex: 10,
  },
  [WidgetType.Ear]: {
    zIndex: 102,
  },
  [WidgetType.Accessories]: {
    zIndex: 103,
  },
  [WidgetType.Eyes]: {
    zIndex: 50,
  },  
  [WidgetType.Mouth]: {
    zIndex: 100,
  },
  [WidgetType.Beard]: {
    zIndex: 105,
  },
  [WidgetType.Hair]: {
    zIndex: 80,
  },  
};