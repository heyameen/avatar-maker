import { type NONE } from "@/constants";
import {
  type BeardShape,
  type AccessoriesShape,
  type EyesShape,
  type FaceShape,
  type Gender,
  type SmilesShape,
  type HairShape,
  type WrapperShape,
} from "@/enums";

export type None = typeof NONE;

export interface Widget<Shape> {
  shape: Shape | None;
  zIndex?: number;
  fillColor?: string;
  strokeColor?: string;
}

export type AvatarWidgets = {
  face: Widget<FaceShape>;
  hair: Widget<HairShape>;
  accessories: Widget<AccessoriesShape>;
  eyes: Widget<EyesShape>;
  mouth: Widget<SmilesShape>;
  beard: Widget<BeardShape>;
};

export interface AvatarSettings {
  gender: [Gender, Gender];

  wrapperShape: WrapperShape[];
  faceShape: FaceShape[];
  hairShape: HairShape[];
  accessoriesShape: AccessoriesShape[];
  eyesShape: EyesShape[];
  beardShape: BeardShape[];  
  smilesShape: SmilesShape[]
  

  commonColors: string[];
  skinColors: string[];
  backgroundColor: string[];
}

export interface AvatarOption {
  gender?: Gender;

  wrapperShape?: `${WrapperShape}`;

  background: {
    color: string;
  };

  widgets: Partial<AvatarWidgets>;
}

export interface AppState {
  history: {
    past: AvatarOption[];
    present: AvatarOption;
    future: AvatarOption[];
  };
  isCollapsed: boolean;
}

export interface AppActions {
    setAvatarOption: (newOption: AvatarOption) => void;
    setSidebarStatus: (isCollapsed: boolean) => void;
}
