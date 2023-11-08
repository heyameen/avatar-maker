import { AvatarOption, None } from "@/types";
import { AVATAR_LAYER, NONE, SETTINGS, SPECIAL_AVATARS } from "@/constants";
import {
  BeardShape,
  AccessoriesShape,
  Gender,
  HairShape,
  WidgetType,
} from "@/enums";
import { previewData } from "./assets-data";


function getRandomValue<Item = unknown>(
  arr: Item[],
  {
    avoid = [],
    usually = [],
  }: { avoid?: unknown[]; usually?: (Item | "none")[] } = {}
): Item {
  const avoidValues = avoid.filter(Boolean);
  const filteredArr = arr.filter((it) => !avoidValues.includes(it));

  const usuallyValues = usually
    .filter(Boolean)
    .reduce<Item[]>((acc, cur) => acc.concat(new Array(15).fill(cur)), []);

  const finalArr = filteredArr.concat(usuallyValues);

  const randomIdx = Math.floor(Math.random() * finalArr.length);
  const randomValue = finalArr[randomIdx];

  return randomValue;
}

export function getRandomFillColor(colors = SETTINGS.commonColors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getRandomAvatarOption(
  presetOption: Partial<AvatarOption> = {},
  useOption: Partial<AvatarOption> = {}
): AvatarOption {
  const gender = getRandomValue(SETTINGS.gender);

  const beardList: BeardShape[] = [];
  let HairList: HairShape[] = [
    HairShape.Hijab,
    HairShape.Bangs,
    HairShape.Braids,
  ];

  if (gender === Gender.Male) {
    beardList.push(
      BeardShape.Beard,
      BeardShape.Fuzz,
      BeardShape.Goatee,
      BeardShape.Mustache
    );
    HairList = SETTINGS.hairShape.filter((shape) => !HairList.includes(shape));
  }

  const beardShape = getRandomValue<BeardShape | None>(beardList, {
    usually: [NONE],
  });

  const hairShape = getRandomValue(HairList, {
    avoid: [useOption.widgets?.hair?.shape],
  });
  const hairColor = getRandomFillColor();

  const avatarOption: AvatarOption = {
    gender,
    wrapperShape: presetOption?.wrapperShape || getRandomValue(SETTINGS.wrapperShape),
    background: {
      color: getRandomValue(SETTINGS.backgroundColor, {
        avoid: [
          useOption.background?.color,
          (hairShape === HairShape.WavyBob ) &&
            hairColor, // Handle special cases and prevent color conflicts.
        ],
      }),
    },
    widgets: {
      face: {
        shape: getRandomValue(SETTINGS.faceShape),
        fillColor: getRandomFillColor(SETTINGS.skinColors),
      },
      hair: {
        shape: hairShape,
        fillColor: hairColor,
      },      
      accessories: {
        shape: getRandomValue<AccessoriesShape | None>(SETTINGS.accessoriesShape, {
          usually: [NONE],
        }),
      },      
      eyes: {
        shape: getRandomValue(SETTINGS.eyesShape, {
          avoid: [useOption.widgets?.eyes?.shape],
        }),
      },    
      smile: {
        shape: getRandomValue(SETTINGS.smileShape, {
          avoid: [useOption.widgets?.smile?.shape],
        }),
      },
      beard: {
        shape: beardShape,
        ...(beardShape === BeardShape.Beard || BeardShape.Fuzz
          ? { zIndex: AVATAR_LAYER["smile"].zIndex - 1 }
          : undefined),
      },      
    },
  };

  return avatarOption;
}

export const getWidgets = async (widgetType: WidgetType) => {
  const list = SETTINGS[`${widgetType}Shape`];
  const promises: Promise<string>[] = list.map(async (widget: string) => {
    if (widget !== "none" && previewData?.[widgetType]?.[widget]) {
      return (await previewData[widgetType][widget]()).default;
    }
    return "X";
  });
  const svgRawList = await Promise.all(promises).then((raw) => {
    return raw.map((svgRaw, i) => {
      return {
        widgetType,
        widgetShape: list[i],
        svgRaw,
      };
    });
  });
  return svgRawList;
};

export function getSpecialAvatarOption(): AvatarOption {
  return SPECIAL_AVATARS[Math.floor(Math.random() * SPECIAL_AVATARS.length)];
}
