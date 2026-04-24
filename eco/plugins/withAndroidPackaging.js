/**
 * Custom Expo Config Plugin
 * Inserts a `packaging { resources { pickFirsts } }` block into
 * android/app/build.gradle to resolve duplicate META-INF file conflicts.
 *
 * Affected JARs:
 *  - com.squareup.okhttp3:logging-interceptor
 *  - org.jspecify:jspecify
 */
const { withAppBuildGradle } = require('@expo/config-plugins');

const DUPLICATE_FILES = [
  'META-INF/versions/9/OSGI-INF/MANIFEST.MF',
];

module.exports = function withAndroidPackaging(config) {
  return withAppBuildGradle(config, (config) => {
    const contents = config.modResults.contents;

    // Avoid applying the patch twice
    if (contents.includes('META-INF/versions/9/OSGI-INF/MANIFEST.MF')) {
      return config;
    }

    const pickFirstEntries = DUPLICATE_FILES.map((f) => `            pickFirsts += ['${f}']`).join('\n');

    const packagingBlock = [
      '    packaging {',
      '        resources {',
      pickFirstEntries,
      '        }',
      '    }',
    ].join('\n');

    // Insert right after the opening of the android { block
    config.modResults.contents = contents.replace(
      /^(android\s*\{)/m,
      `$1\n${packagingBlock}`
    );

    return config;
  });
};
