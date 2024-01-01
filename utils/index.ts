import {
  AvatarOption,
  None,
  ColorVariations,
  OriginalVariations,
  ModifiedColors,
  AnalysisCache,
} from "@/types";
import {
  AVATAR_LAYER,
  NONE,
  SETTINGS,
  SPECIAL_AVATARS,
  SCREEN,
} from "@/constants";
import {
  BeardShape,
  AccessoriesShape,
  Gender,
  HairShape,
  WidgetType,
} from "@/enums";
import { previewData } from "./assets-data";
import chroma from "chroma-js";

export function getRandomValue<Item = unknown>(
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
    wrapperShape:
      presetOption?.wrapperShape || getRandomValue(SETTINGS.wrapperShape),
    background: {
      color: "linear-gradient(45deg, #E3648C, #D97567)",
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
        shape: getRandomValue<AccessoriesShape | None>(
          SETTINGS.accessoriesShape,
          {
            usually: [NONE],
          }
        ),
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

export const initializeCollapsedState = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth <= SCREEN.lg;
  }
  return false;
};

const isValidColor = (color: string): boolean => {
  const invalidColors = ["none", "transparent", "inherit", "$fillcolor"];
  console.log(
    "isValidColors",
    color,
    !invalidColors.includes(color.toLowerCase())
  );
  return !invalidColors.includes(color.toLowerCase());
};

export const analyzeSVGColors = (svgContent: string): ColorVariations => {
  const uniqueColors = new Set<string>();

  // Regex to find all fill attributes in SVG content
  const fillRegex = /fill=["']?([^"']+)["']?/g;
  let match: RegExpExecArray | null;

  // Iterate over all fill attributes and add unique colors to the set
  while ((match = fillRegex.exec(svgContent)) !== null) {
    // Add the color to the set if it's not a URL (gradient, etc.)
    if (!match[1].startsWith("url")) {
      uniqueColors.add(match[1]);
    }
  }

  const colors = Array.from(uniqueColors).filter(isValidColor);

  if (colors.length === 0) {
    throw new Error("No valid colors found in SVG content.");
  }

  const baseColor = colors[0];
  const variations: { [color: string]: number } = {};

  // Calculate variations relative to the base color
  colors.forEach((color) => {
    const brightnessDifference =
      chroma(color).luminance() - chroma(baseColor).luminance();
    variations[color] = brightnessDifference;
  });

  return { baseColor, variations };
};

export const createColorVariation = (baseColor: string, variation: number) => {
  return chroma(baseColor)
    .luminance(chroma(baseColor).luminance() + variation)
    .hex();
};

export const applyDynamicVariations = (
  baseColor: string,
  originalVariations: OriginalVariations
) => {
  let modifiedColors: ModifiedColors = {};
  for (let [originalColor, variation] of Object.entries(originalVariations)) {
    modifiedColors[originalColor] = createColorVariation(baseColor, variation);
  }
  return modifiedColors;
};

export const svgAnalysisCache: AnalysisCache = {};
