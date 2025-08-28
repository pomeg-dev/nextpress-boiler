const fs = require("fs");
const path = require("path");
require("dotenv").config();

const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_API_URL = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;

const createRgba = (color, isRgb) => {
  if (!color.a || !color.b || !color.g || !color.r) {
    return null;
  }
  if (isRgb) {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `${r} ${g} ${b}`;
  } else {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `${r}, ${g}, ${b}, ${color.a}`;
  }
};

const transformedStrings = (str) => {
  const regex = /\/([^\/]+)\/([^\/]+)$/;
  const match = str.match(regex);
  
  if (match && match.length >= 3) {
    return `${match[1]}-${match[2]}`;
  }
  
  return str;
};

async function fetchFigmaVariables() {
  if (!FIGMA_FILE_KEY || !FIGMA_ACCESS_TOKEN || !FIGMA_API_URL) {
    console.log("Figma ENV vars not found, skipping variable fetch...");
    return null;
  }

  try {
    const response = await fetch(FIGMA_API_URL, {
      headers: {
        "X-Figma-Token": FIGMA_ACCESS_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || !data.meta.variables) {
      throw new Error('Variables not found');
    }

    // Write var list to json file.
    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync('scripts/figma-variables.json', jsonContent, 'utf-8');
    console.log("✅ Raw Figma variables saved to figma-variables.json");

    // Filter out colours.
    const colorVariables = Object.values(data.meta.variables)
      .filter((variable) => {
        return variable.resolvedType === "COLOR" 
          && variable.scopes[0] === 'ALL_SCOPES'
      });

    // Filter out body sizes.
    const bodySizes = Object.values(data.meta.variables)
      .filter((variable) => {
        return variable.name.includes('typography')
          && variable.name.includes('body-')
          && variable.name.includes('/font-size')
      });

    // Filter out headings.
    const headings = Object.values(data.meta.variables)
      .filter((variable) => {
        return variable.name.includes('typography')
          && (
            variable.name.includes('heading') || 
            variable.name.includes('body') || 
            variable.name.includes('card')
          )
          && !variable.name.includes('text')
      });

    // Filter out section spacers.
    const sectionSpacers = Object.values(data.meta.variables)
      .filter((variable) => variable.name.includes('section-padding'));

    // Filter out border radii.
    const borderRadii = Object.values(data.meta.variables)
      .filter((variable) => {
        return variable.name.includes('border-radius/')
          && !variable.name.includes('none')
          && !variable.name.includes('circular')
      });

    // Filter out page widths
    const pageWidths = Object.values(data.meta.variables)
      .filter((variable) => {
        const collectionId = variable.variableCollectionId;
        return (
            variable.name === 'page/default-width' ||
            variable.name === 'page/min-width' ||
            variable.name === 'page/max-width' ||
            variable.name === 'page/margin' ||
            variable.name === 'page/columns' ||
            variable.name === 'page/gutter'
          )
          && data.meta.variableCollections?.[collectionId]
          && data.meta.variableCollections[collectionId].name.toLowerCase().includes('responsive')
      });
    
    // Build scss string.
    let scssContent = "/* Auto-generated from Figma API */\n";
    scssContent += ":root {\n";

    // Add colours.
    if (colorVariables) {
      scssContent += "/* COLOUR VARIABLES */\n";
      colorVariables.forEach((variable) => {
        const variableName = variable.name.toLowerCase().replace(/[\s/]+/g, "-");
        const modeKey = Object.keys(variable.valuesByMode)[0];
        const isRgb = variableName.includes('-base');
        if (isRgb) {
          const rgbaValue = createRgba(variable.valuesByMode[modeKey], true);
          if (variableName && rgbaValue) {
            scssContent += `--${variableName}-rgb: ${rgbaValue};\n`;
          }
        }
        const rgbaValue = createRgba(variable.valuesByMode[modeKey]);
        if (variableName && rgbaValue) {
          scssContent += `--${variableName}: ${rgbaValue};\n`;
        }
      });
    }

    // Add body sizes.
    // if (bodySizes) {
    //   scssContent += "\n/* BODY COPY VARIABLES */\n";
    //   bodySizes.forEach((variable) => {
    //     const regex = /\/([^\/]+)\/font-size$/;
    //     const match = variable.name.match(regex);
    //     const variableName = match[1].toLowerCase();
    //     const pxValue = Object.values(variable.valuesByMode)[0] + 'px';
    //     scssContent += `--${variableName}: ${pxValue};\n`;
    //   });
    // }

    // Add border radius.
    if (borderRadii) {
      scssContent += "\n/* BORDER RADIUS VARIABLES */\n";
      borderRadii.forEach((variable) => {
        const variableName = variable.name.toLowerCase().replace(/[\s/]+/g, '-');
        const pxValue = Object.values(variable.valuesByMode)[0] + 'px';
        scssContent += `--${variableName}: ${pxValue};\n`;
      });
    }

    // Add all other responsive variables.
    const responsiveModes = {};
    const addedVariables = new Set();
    if (pageWidths) {
      scssContent += "\n";
      pageWidths.forEach((variable) => {
        // Set responsive mode values.
        const collectionId = variable.variableCollectionId;
        const valueName = variable.name.toLowerCase().replace('page/', '');

        if (data.meta.variableCollections?.[collectionId]) {
          const collection = data.meta.variableCollections[collectionId];
          collection.modes.forEach((mode) => {
            const modeKey = mode.name.toLowerCase();

            if (!responsiveModes[modeKey]) {
              responsiveModes[modeKey] = {};
            }

            let handle = '';
            switch (modeKey) {
              case 'desktop':
                handle = 'xl';
                break;
              case 'laptop':
                handle = 'lg';
                break;
              case 'tablet':
                handle = 'md';
                break;
              case 'mobile':
                handle = 'sm';
                break;
            }

            if (!responsiveModes[modeKey][valueName]) {
              responsiveModes[modeKey][valueName] = variable.valuesByMode[mode.modeId];
            }

            if (!responsiveModes[modeKey]['handle']) {
              responsiveModes[modeKey]['handle'] = handle;
            }

            if (!responsiveModes[modeKey]['modeId']) {
              responsiveModes[modeKey]['modeId'] = mode.modeId;
            }
          });
        }
      });

      Object.values(responsiveModes).forEach((mode) => {
        const containerSize = mode['default-width'] - (mode.margin * 2);
        const colSize =  containerSize / mode.columns;
        if (mode.handle === 'xl') {
          // Add default desktop vars.
          scssContent += `/* CONTAINER */\n`;
          scssContent += `--pagewidth: ${mode['default-width']}px;\n`;
          scssContent += `--container: ${containerSize}px;\n`;
          scssContent += `--margin: ${mode.margin}px;\n`;
          scssContent += `--columns: ${mode.columns};\n`;
          scssContent += `--col-size: ${colSize}px;\n`;
          scssContent += `--gutter: ${mode.gutter}px;\n`;

          if (headings) {
            scssContent += `\n/* HEADINGS */\n`;
            headings.forEach((heading) => {
              const modeKeys = Object.keys(heading.valuesByMode);
              const currentIndex = modeKeys.indexOf(mode.modeId);
              const nextMode = modeKeys[currentIndex + 1];
              const headingName = transformedStrings(heading.name);
              const headingValue = heading.valuesByMode[mode.modeId];
              const minValue = nextMode 
                ? heading.valuesByMode[nextMode] 
                : Math.max(headingValue - 20, 18);
              const vwValue = headingValue / (containerSize / 100);
              const clampValue = `clamp(${minValue}px, ${vwValue}vw, ${headingValue}px)`;
              if (!addedVariables.has(`${mode.handle}-${headingName}`)) {
                if (
                  headingName.includes('font-size') ||
                  headingName.includes('line-height')
                ) {
                  scssContent += `--${headingName}: ${clampValue};\n`;
                } else {
                  scssContent += `--${headingName}: ${headingValue}px;\n`;
                }
                addedVariables.add(`${mode.handle}-${headingName}`);
              }
            });
          }

          // Add section spacers.
          if (sectionSpacers) {
            scssContent += "\n/* SECTION SPACER VARIABLES */\n";
            sectionSpacers.forEach((variable) => {
              const variableName = variable.name.toLowerCase().replace(/[\s/]+/g, '-');
              const variableValue = variable.valuesByMode[mode.modeId];
              if (!addedVariables.has(`${mode.handle}-${variableName}`)) {
                scssContent += `--${variableName}: ${variableValue}px;\n`;
                addedVariables.add(`${mode.handle}-${variableName}`);
              }
            });
          }
        } else {
          // Add all other media vars.
          let headingsVars = '';
          if (headings) {
            headings.forEach((heading, index) => {
              const modeKeys = Object.keys(heading.valuesByMode);
              const currentIndex = modeKeys.indexOf(mode.modeId);
              const nextMode = modeKeys[currentIndex + 1];
              const headingName = transformedStrings(heading.name);
              const headingValue = heading.valuesByMode[mode.modeId];
              let minValue = nextMode 
                ? heading.valuesByMode[nextMode] 
                : Math.max(headingValue - 16, 18);
              minValue = headingValue < minValue ? headingValue : minValue;
              const vwValue = headingValue / (containerSize / 100);
              const clampValue = `clamp(${minValue}px, ${vwValue}vw, ${headingValue}px)`;
              if (!addedVariables.has(`${mode.handle}-${headingName}`)) {
                if (
                  headingName.includes('font-size') ||
                  headingName.includes('line-height')
                ) {
                  headingsVars += `--${headingName}: ${clampValue};\n`;
                } else {
                  headingsVars += `--${headingName}: ${headingValue}px;\n`;
                }
                addedVariables.add(`${mode.handle}-${headingName}`);
              }
            });
          }

          let spacerVars = '';
          if (sectionSpacers) {
            sectionSpacers.forEach((spacer) => {
              const spacerName = spacer.name.toLowerCase().replace(/[\s/]+/g, '-');
              const spacerValue = spacer.valuesByMode[mode.modeId];
              if (!addedVariables.has(`${mode.handle}-${spacerName}`)) {
                spacerVars += `--${spacerName}: ${spacerValue}px;\n`;
                addedVariables.add(`${mode.handle}-${spacerName}`);
              }
            });
          }

          scssContent += `\n@media screen and (max-width: ${mode['default-width']}px) {
            /* CONTAINER */
            --page-width: ${mode['default-width']}px;
            --container: ${containerSize}px;
            --margin: ${mode.margin}px;
            --columns: ${mode.columns};
            --col-size: ${colSize}px;
            --gutter: ${mode.gutter}px;
            /* HEADINGS */
            ${headingsVars}
            /* SECTION SPACER VARIABLES */
            ${spacerVars}
          }`.replace(/^\s+/gm, '').trim() + '\n';
        }
      });
    }

    // Closure.
    scssContent += "}\n";

    // Make file.
    const scssFilePath = path.join(__dirname, "../ui/styles/figma-variables.scss");
    fs.mkdirSync(path.dirname(scssFilePath), { recursive: true });
    fs.writeFileSync(scssFilePath, scssContent, "utf-8");

    const wpScssFilePath = path.join(__dirname, "../../backend/wordpress/wp-content/themes/nextpress-theme/admin/figma-variables.css");
    fs.mkdirSync(path.dirname(wpScssFilePath), { recursive: true });
    fs.writeFileSync(wpScssFilePath, scssContent, "utf-8");

    console.log("✅ Figma variables updated in ui/styles/figma-variables.scss");
  } catch (error) {
    console.error("❌ Error fetching Figma variables:", error);
  }
}

fetchFigmaVariables();
