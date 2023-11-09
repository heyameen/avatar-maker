import {
  AccessoriesShape,
  BeardShape,
  EyesShape,
  FaceShape,  
  HairShape,
  SmilesShape,
  WidgetType,
} from "@/enums";

type Data = Readonly<{
  [key in `${WidgetType}`]: {
    [key in string]: () => Promise<any>;
  };
}>;

const widgetData: Data = {
  [WidgetType.Face]: {
    [FaceShape.Base]: () => import(`../assets/avatar/face/base.svg`),
  },
  [WidgetType.Eyes]: {
    [EyesShape.Cheery]: () => import(`../assets/avatar/eyes/cheery.svg`),
    [EyesShape.Confused]: () => import(`../assets/avatar/eyes/confused.svg`),
    [EyesShape.Normal]: () => import(`../assets/avatar/eyes/normal.svg`),
    [EyesShape.Sleepy]: () => import(`../assets/avatar/eyes/sleepy.svg`),
    [EyesShape.Starstruck]: () =>
      import(`../assets/avatar/eyes/starstruck.svg`),
    [EyesShape.Wink]: () => import(`../assets/avatar/eyes/winking.svg`),
    [EyesShape.angry]: () => import(`../assets/avatar/eyes/angry.svg`),
    [EyesShape.sad]: () => import(`../assets/avatar/eyes/sad.svg`),
  },

  [WidgetType.Beard]: {
    [BeardShape.Mustache]: () => import(`../assets/avatar/beard/mustache.svg`),
    [BeardShape.Beard]: () => import(`../assets/avatar/beard/fullbeard.svg`),
    [BeardShape.Fuzz]: () => import(`../assets/avatar/beard/fuzz.svg`),
    [BeardShape.Goatee]: () => import(`../assets/avatar/beard/goatee.svg`),
  },

  [WidgetType.Accessories]: {
    [AccessoriesShape.Glasses]: () =>
      import(`../assets/avatar/accessories/glasses.svg`),
    [AccessoriesShape.Sunglasses]: () =>
      import(`../assets/avatar/accessories/sunglasses.svg`),
    [AccessoriesShape.FaceMask]: () =>
      import(`../assets/avatar/accessories/facemask.svg`),
    [AccessoriesShape.Mustache]: () =>
      import(`../assets/avatar/accessories/mustache.svg`),
    [AccessoriesShape.CatEars]: () =>
      import(`../assets/avatar/accessories/catears.svg`),
    [AccessoriesShape.SleepMask]: () =>
      import(`../assets/avatar/accessories/sleepmask.svg`),
    [AccessoriesShape.SailorMoon]: () =>
      import(`../assets/avatar/accessories/sailormoon.svg`),
    [AccessoriesShape.ClownNose]: () =>
      import(`../assets/avatar/accessories/clownnose.svg`),
  },

  [WidgetType.Smile]: {
    [SmilesShape.AwkwardSmile]: () =>
      import(`../assets/avatar/smiles/awkward.svg`),
    [SmilesShape.Braces]: () => import(`../assets/avatar/smiles/braces.svg`),
    [SmilesShape.GapSmile]: () => import(`../assets/avatar/smiles/gap.svg`),
    [SmilesShape.Kawaii]: () => import(`../assets/avatar/smiles/kawaii.svg`),
    [SmilesShape.OpenedSad]: () =>
      import(`../assets/avatar/smiles/opensad.svg`),
    [SmilesShape.OpenedSmile]: () =>
      import(`../assets/avatar/smiles/opensmile.svg`),
    [SmilesShape.TeethSmile]: () =>
      import(`../assets/avatar/smiles/teethsmile.svg`),
    [SmilesShape.Unimpressed]: () =>
      import(`../assets/avatar/smiles/unimpressed.svg`),
  },

  [WidgetType.Hair]: {
    [HairShape.Bangs]: () => import(`../assets/avatar/hair/bangs.svg`),
    [HairShape.BowlCut]: () => import(`../assets/avatar/hair/bowlcut.svg`),
    [HairShape.Braids]: () => import(`../assets/avatar/hair/braids.svg`),
    [HairShape.Bun]: () => import(`../assets/avatar/hair/bun.svg`),
    [HairShape.CurlyBob]: () => import(`../assets/avatar/hair/curlybob.svg`),
    [HairShape.CurlyShort]: () =>
      import(`../assets/avatar/hair/curlyshort.svg`),
    [HairShape.Dreads]: () => import(`../assets/avatar/hair/dreads.svg`),
    [HairShape.FroBun]: () => import(`../assets/avatar/hair/frobun.svg`),
    [HairShape.HalfShaved]: () =>
      import(`../assets/avatar/hair/halfShaved.svg`),
    [HairShape.Hijab]: () => import(`../assets/avatar/hair/hijab.svg`),
    [HairShape.Mohawk]: () => import(`../assets/avatar/hair/mohawk.svg`),
    [HairShape.Shaved]: () => import(`../assets/avatar/hair/shaved.svg`),
    [HairShape.Short]: () => import(`../assets/avatar/hair/short.svg`),
    [HairShape.Straight]: () => import(`../assets/avatar/hair/straight.svg`),
    [HairShape.WavyBob]: () => import(`../assets/avatar/hair/wavybob.svg`),
  },
};

const previewData: Data = {
  [WidgetType.Face]: {
    [FaceShape.Base]: () => import(`../assets/avatar/face/base.svg`),
  },
  [WidgetType.Eyes]: {
    [EyesShape.Cheery]: () => import(`../assets/avatar/eyes/cheery.svg`),
    [EyesShape.Confused]: () => import(`../assets/avatar/eyes/confused.svg`),
    [EyesShape.Normal]: () => import(`../assets/avatar/eyes/normal.svg`),
    [EyesShape.Sleepy]: () => import(`../assets/avatar/eyes/sleepy.svg`),
    [EyesShape.Starstruck]: () => import(`../assets/avatar/eyes/starstruck.svg`),
    [EyesShape.Wink]: () => import(`../assets/avatar/eyes/winking.svg`),
    [EyesShape.angry]: () => import(`../assets/avatar/eyes/angry.svg`),
    [EyesShape.sad]: () => import(`../assets/avatar/eyes/sad.svg`),
  },

  [WidgetType.Beard]: {
    [BeardShape.Mustache]: () => import(`../assets/avatar/beard/mustache.svg`),
    [BeardShape.Beard]: () => import(`../assets/avatar/beard/fullbeard.svg`),
    [BeardShape.Fuzz]: () => import(`../assets/avatar/beard/fuzz.svg`),
    [BeardShape.Goatee]: () => import(`../assets/avatar/beard/goatee.svg`),
  },

  [WidgetType.Accessories]: {
    [AccessoriesShape.Glasses]: () =>
      import(`../assets/avatar/accessories/glasses.svg`),
    [AccessoriesShape.Sunglasses]: () =>
      import(`../assets/avatar/accessories/sunglasses.svg`),
    [AccessoriesShape.FaceMask]: () =>
      import(`../assets/avatar/accessories/facemask.svg`),
    [AccessoriesShape.Mustache]: () =>
      import(`../assets/avatar/accessories/mustache.svg`),
    [AccessoriesShape.CatEars]: () =>
      import(`../assets/avatar/accessories/catears.svg`),
    [AccessoriesShape.SleepMask]: () =>
      import(`../assets/avatar/accessories/sleepmask.svg`),
    [AccessoriesShape.SailorMoon]: () =>
      import(`../assets/avatar/accessories/sailormoon.svg`),
    [AccessoriesShape.ClownNose]: () =>
      import(`../assets/avatar/accessories/clownnose.svg`),
  },

  [WidgetType.Smile]: {
    [SmilesShape.AwkwardSmile]: () =>
      import(`../assets/avatar/smiles/awkward.svg`),
    [SmilesShape.Braces]: () => import(`../assets/avatar/smiles/braces.svg`),
    [SmilesShape.GapSmile]: () => import(`../assets/avatar/smiles/gap.svg`),
    [SmilesShape.Kawaii]: () => import(`../assets/avatar/smiles/kawaii.svg`),
    [SmilesShape.OpenedSad]: () => import(`../assets/avatar/smiles/opensad.svg`),
    [SmilesShape.OpenedSmile]: () =>
      import(`../assets/avatar/smiles/opensmile.svg`),
    [SmilesShape.TeethSmile]: () =>
      import(`../assets/avatar/smiles/teethsmile.svg`),
    [SmilesShape.Unimpressed]: () =>
      import(`../assets/avatar/smiles/unimpressed.svg`),
  },

  [WidgetType.Hair]: {
    [HairShape.Bangs]: () => import(`../assets/avatar/hair/bangs.svg`),
    [HairShape.BowlCut]: () => import(`../assets/avatar/hair/bowlcut.svg`),
    [HairShape.Braids]: () => import(`../assets/avatar/hair/braids.svg`),
    [HairShape.Bun]: () => import(`../assets/avatar/hair/bun.svg`),
    [HairShape.CurlyBob]: () => import(`../assets/avatar/hair/curlybob.svg`),
    [HairShape.CurlyShort]: () => import(`../assets/avatar/hair/curlyshort.svg`),
    [HairShape.Dreads]: () => import(`../assets/avatar/hair/dreads.svg`),
    [HairShape.FroBun]: () => import(`../assets/avatar/hair/frobun.svg`),
    [HairShape.HalfShaved]: () => import(`../assets/avatar/hair/halfShaved.svg`),
    [HairShape.Hijab]: () => import(`../assets/avatar/hair/hijab.svg`),
    [HairShape.Mohawk]: () => import(`../assets/avatar/hair/mohawk.svg`),
    [HairShape.Shaved]: () => import(`../assets/avatar/hair/shaved.svg`),
    [HairShape.Short]: () => import(`../assets/avatar/hair/short.svg`),
    [HairShape.Straight]: () => import(`../assets/avatar/hair/straight.svg`),
    [HairShape.WavyBob]: () => import(`../assets/avatar/hair/wavybob.svg`),
  },

};

export { previewData, widgetData };
