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

export const analyzeSVGColors = (svgContent: string): ColorVariations => {
  const uniqueColors = new Set<string>();
  const fillRegex = /fill=["']?([^"']+)["']?/g;
  let match: RegExpExecArray | null;

  while ((match = fillRegex.exec(svgContent)) !== null) {
    if (!match[1].startsWith("url")) {
      uniqueColors.add(match[1]);
    }
  }

  const colors = Array.from(uniqueColors).filter((color) =>
    chroma.valid(color)
  );
  if (colors.length === 0) {
    throw new Error("No valid colors found in SVG content.");
  }

  const baseColor = colors[0];
  const baseHSL = chroma(baseColor).hsl();
  const variations: {
    [color: string]: { hue: number; saturation: number; lightness: number };
  } = {};

  colors.forEach((color) => {
    const colorHSL = chroma(color).hsl();
    variations[color] = {
      hue: colorHSL[0] - baseHSL[0],
      saturation: colorHSL[1] - baseHSL[1],
      lightness: colorHSL[2] - baseHSL[2],
    };
  });

  return { baseColor, variations };
};

const createColorVariation = (
  baseColor: string,
  variation: { hue: number; saturation: number; lightness: number }
): string => {
  let color = chroma(baseColor);
  let currentHue = color.get("hsl.h");
  let currentSaturation = color.get("hsl.s");
  let currentLightness = color.luminance();

  if (variation.hue !== null && !isNaN(variation.hue)) {
    let newHue = (currentHue + variation.hue + 360) % 360;
    color = color.set("hsl.h", newHue);
  }

  if (variation.saturation !== null && !isNaN(variation.saturation)) {
    let newSaturation = Math.min(
      Math.max(currentSaturation + variation.saturation * 0.5, 0),
      0.95
    );
    color = color.set("hsl.s", newSaturation);
  }

  if (variation.lightness !== null && !isNaN(variation.lightness)) {
    let newLightness = Math.max(
      currentLightness + variation.lightness * 0.5,
      0.3
    );
    newLightness = Math.min(newLightness, 1);
    color = color.luminance(newLightness);
  }

  console.log(`New color: ${color.hex()}`);
  return color.hex();
};

export const applyDynamicVariationsDOM = (
  svgContent: string,
  baseColor: string,
  originalVariations: OriginalVariations
) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(svgContent, "image/svg+xml");
  const svg = xmlDoc.getElementsByTagName("svg")[0];

  // Function to apply colors recursively
  const applyColors = (element: Element) => {
    const fill = element.getAttribute("fill");

    if (fill && chroma.valid(fill)) {
      const variation = originalVariations[fill];
      if (variation) {
        const newColor = createColorVariation(baseColor, variation);
        console.log(
          `Element: ${element.tagName}, Old color: ${fill}, New color: ${newColor}`
        );

        element.setAttribute("fill", newColor);
      }
    }

    // Recursively apply colors to children
    for (const child of element.children) {
      applyColors(child);
    }
  };

  applyColors(svg);

  const masks = svg.querySelectorAll("mask");
  masks.forEach((mask) => {
    const maskId = mask.id;
    const maskedElements = svg.querySelectorAll(`[mask="url(#${maskId})"]`);

    maskedElements.forEach((elem) => {
      if (chroma.valid(baseColor)) {
        elem.setAttribute("fill", baseColor);
      }
    });
  });

  // Serialize the updated SVG back to a string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
};

export const svgAnalysisCache: AnalysisCache = {};
