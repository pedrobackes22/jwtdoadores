import { validarApiDispositivo } from "./shared/configBuild.js";

export default function ({ config }) {
  // EAS deve interromper o build antes de embutir URL local/de emulador.
  if (
    process.env.ALIMENTA_APK === "1" ||
    process.env.EAS_BUILD === "true" ||
    process.env.EAS_BUILD_PROFILE
  ) {
    validarApiDispositivo(process.env.EXPO_PUBLIC_API_URL, {
      publica: process.env.ALIMENTA_API_PUBLICA === "1",
    });
  }
  // HTTP permanece apenas no desenvolvimento local; builds públicos usam HTTPS.
  if (process.env.ALIMENTA_API_PUBLICA === "1") {
    return {
      ...config,
      plugins: config.plugins.map((plugin) =>
        Array.isArray(plugin) && plugin[0] === "expo-build-properties"
          ? [
              plugin[0],
              {
                ...plugin[1],
                android: { ...plugin[1].android, usesCleartextTraffic: false },
              },
            ]
          : plugin,
      ),
    };
  }
  return config;
}
