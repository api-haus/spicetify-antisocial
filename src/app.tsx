import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enLocale from "./locales/en.json";
import uaLocale from "./locales/ua.json";
import { delay, getLocalStorageDataFromKey } from "./util";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    // the translations
    resources: {
      en: enLocale,
      ua: uaLocale,
    },
    detection: {
      order: ["navigator", "htmlTag"],
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

const SETTINGS_KEY = "AlwaysPrivateSessionEnabled";

/**
 * Enforce private session
 * @param isAlwaysPrivateMode If we should always enter private session
 */
const setState = async (isAlwaysPrivateMode: boolean) => {
  const isInPrivateSession = Boolean(
    document.querySelector(".main-noConnection-button")
  );
  const isMenuOpen = Boolean(
    document.querySelector(".main-contextMenu-menuItem")
  );
  const shouldTogglePrivacyMode = isInPrivateSession !== isAlwaysPrivateMode;

  // Open menu
  if (shouldTogglePrivacyMode && !isMenuOpen) {
    const menuButton = document.querySelector(
      "button.main-userWidget-box"
    ) as HTMLButtonElement;
    menuButton!.click();
    await delay(1000);
  }

  // Toggle privacy mode
  if (shouldTogglePrivacyMode) {
    const buttonElement = document.querySelector(
      ".main-contextMenu-menu > li:nth-last-child(3) > button"
    ) as HTMLButtonElement;
    buttonElement!.click();
  }
};

/** ******************
 * Main app
 ********************/
async function main() {
  const { t } = i18n;

  let { Player, Menu, Platform } = Spicetify;

  while (!Player || !Menu || !Platform) {
    // Wait for Spicetify to load
    await new Promise((resolve) => setTimeout(resolve, 100));
    Player = Spicetify.Player;
    Menu = Spicetify.Menu;
    Platform = Spicetify.Platform;
  }

  let isEnabled = getLocalStorageDataFromKey(SETTINGS_KEY, false);

  // Add menu item and menu click handler
  new Menu.SubMenu(t("menuTitle"), [
    new Menu.Item(t("enabled"), isEnabled, (self) => {
      isEnabled = !isEnabled;
      localStorage.setItem(SETTINGS_KEY, isEnabled);
      self.setState(isEnabled);
      setState(isEnabled);
    }),
  ]).register();

  await setState(isEnabled);
}

export default main;
