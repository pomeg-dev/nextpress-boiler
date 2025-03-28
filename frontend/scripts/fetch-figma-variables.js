const fs = require("fs");
const path = require("path");
require("dotenv").config();

const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_API_URL = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;

const createRgba = (color) => {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `${r} ${g} ${b}`;
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

    // Filter out colours.
    const colorVariables = Object.values(data.meta.variables)
      .filter((variable) => {
        return variable.resolvedType === "COLOR" 
          && variable.scopes[0] === 'ALL_SCOPES'
          && !(/\d/.test(variable.name))
          && (
            variable.name.toLowerCase().includes('base') ||
            variable.name.toLowerCase().includes('dark') ||
            variable.name.toLowerCase().includes('content') ||
            variable.name.toLowerCase().includes('gradient')
          )
      });

    // Filter out body sizes.
    const bodySizes = Object.values(data.meta.variables)
      .filter((variable) => {
        return variable.name.includes('text/styles/body-')
          && variable.name.includes('/size')
      });

    // Filter out headings.
    const headings = Object.values(data.meta.variables)
      .filter((variable) => {
        return variable.name.includes('type/heading')
          && variable.scopes.includes('FONT_VARIATIONS')
      });

    // Filter out section spacers.
    const sectionSpacers = Object.values(data.meta.variables)
      .filter((variable) => variable.name.includes('section-spacer'));

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
            variable.name === 'page/margin'
          )
          && data.meta.variableCollections?.[collectionId]
          && data.meta.variableCollections[collectionId].name.toLowerCase().includes('responsive')
      });
    
    // Build scss string.
    let scssContent = "// Auto-generated from Figma API\n";
    scssContent += ":root {\n";

    // Add colours.
    if (colorVariables) {
      scssContent += "// COLOUR VARIABLES\n";
      colorVariables.forEach((variable) => {
        const variableName = variable.name.toLowerCase().replace(/[\s/]+/g, "-");
        const modeKey = Object.keys(variable.valuesByMode)[0];
        const rgbaValue = createRgba(variable.valuesByMode[modeKey]);
        scssContent += `--${variableName}: ${rgbaValue};\n`;
      });
    }

    // Add body sizes.
    if (bodySizes) {
      scssContent += "\n// BODY COPY VARIABLES\n";
      bodySizes.forEach((variable) => {
        const variableName = variable.name
          .toLowerCase()
          .replace('text/styles/', '')
          .replace('/size', '');
        const pxValue = Object.values(variable.valuesByMode)[0] + 'px';
        scssContent += `--${variableName}: ${pxValue};\n`;
      });
    }

    // Add section spacers.
    if (sectionSpacers) {
      scssContent += "\n// SECTION SPACER VARIABLES\n";
      sectionSpacers.forEach((variable) => {
        const variableName = variable.name.toLowerCase().replace(/[\s/]+/g, '-');
        let variableValue = 0;
        const firstEntry = Object.values(variable.valuesByMode)[0];
        const linkedVarId = firstEntry?.id;
        if (linkedVarId && data.meta.variables[linkedVarId]) {
          const linkedVar = data.meta.variables[linkedVarId];
          variableValue = Object.values(linkedVar.valuesByMode)[0];
        }
        scssContent += `--${variableName}: ${variableValue}px;\n`;
      });
    }

    // Add border radius.
    if (borderRadii) {
      scssContent += "\n// BORDER RADIUS VARIABLES\n";
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
        if (mode.handle === 'xl') {
          // Add default desktop vars.
          scssContent += `// CONTAINER\n`;
          scssContent += `--pagewidth: ${mode['default-width']}px;\n`;
          scssContent += `--margin: ${mode.margin}px;\n`;
          scssContent += `--container: ${
            mode['default-width'] - (mode.margin * 2)
          }px;\n`;

          if (headings) {
            scssContent += `\n// HEADINGS\n`;
            headings.forEach((heading) => {
              const headingName = heading.name.replace('type/', '').replace(/[\s/]+/g, '-');
              const headingValue = heading.valuesByMode[mode.modeId];
              if (!addedVariables.has(`${mode.handle}-${headingName}`)) {
                scssContent += `--${headingName}: ${headingValue}px;\n`;
                addedVariables.add(`${mode.handle}-${headingName}`);
              }
            });
          }
        } else {
          // Add all other media vars.
          let headingsVars = '';
          if (headings) {
            headings.forEach((heading) => {
              const headingName = heading.name.replace('type/', '').replace(/[\s/]+/g, '-');
              const headingValue = heading.valuesByMode[mode.modeId];
              if (!addedVariables.has(`${mode.handle}-${headingName}`)) {
                headingsVars += `--${headingName}: ${headingValue}px;\n`;
                addedVariables.add(`${mode.handle}-${headingName}`);
              }
            });
          }

          scssContent += `\n@media screen and (max-width: ${mode['default-width']}px) {
            // CONTAINER
            --margin: ${mode.margin}px;
            --page-width: ${mode['default-width']}px;
            --container: ${
              mode['default-width'] - (mode.margin * 2)
            }px;
            // HEADINGS
            ${headingsVars}
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
    console.log("✅ Figma variables updated in ui/styles/figma-variables.scss");
  } catch (error) {
    console.error("❌ Error fetching Figma variables:", error);
  }
}

fetchFigmaVariables();
