import type { ImageSourcePropType } from "react-native";

// Photos exported from the Figma "Relife" file, used by the mock data.
// With Firebase, PhotoRef becomes a Storage URL and `photoSource` returns { uri }.
const PHOTOS: Record<string, ImageSourcePropType> = {
  baguette: require("@/assets/images/mock/baguette.jpg"),
  "bakery-counter": require("@/assets/images/mock/bakery-counter.jpg"),
  "bakery-interior": require("@/assets/images/mock/bakery-interior.jpg"),
  "bakery-storefront": require("@/assets/images/mock/bakery-storefront.jpg"),
  bread: require("@/assets/images/mock/bread.jpg"),
  "bread-bag": require("@/assets/images/mock/bread-bag.jpg"),
  "bread-crates": require("@/assets/images/mock/bread-crates.jpg"),
  cake: require("@/assets/images/mock/cake.jpg"),
  croissant: require("@/assets/images/mock/croissant.jpg"),
  pastry: require("@/assets/images/mock/pastry.jpg"),
  "pastry-box": require("@/assets/images/mock/pastry-box.jpg"),
  sandwich: require("@/assets/images/mock/sandwich.jpg"),
};

export function photoSource(ref: string | null | undefined): ImageSourcePropType | undefined {
  if (!ref) return undefined;
  if (ref.startsWith("http") || ref.startsWith("file:")) return { uri: ref };
  return PHOTOS[ref];
}
