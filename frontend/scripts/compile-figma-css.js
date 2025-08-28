const sass = require('sass');
const fs = require('fs');
const path = require('path');

async function compileFigmaCSS() {
  try {
    const scssFilePath = path.join(__dirname, '../ui/styles/figma-variables.scss');
    
    // Check if SCSS file exists
    if (!fs.existsSync(scssFilePath)) {
      console.log('Figma variables SCSS file not found, skipping compilation...');
      return;
    }
    
    // Compile SCSS to CSS
    const result = sass.compile(scssFilePath, {
      style: 'compressed',
      loadPaths: [path.dirname(scssFilePath)]
    });
    
    // Extract just the CSS content (remove :root wrapper for inline styles)
    let cssContent = result.css;
    
    // Convert to JavaScript string format for inline styles
    const cssAsJsString = JSON.stringify(cssContent);
    
    // Create TypeScript file with compiled CSS
    const tsContent = `// Auto-generated from figma-variables.scss
export const figmaVariablesCSS = ${cssAsJsString};
`;
    
    const outputPath = path.join(__dirname, '../src/lib/figma-variables.css.ts');
    fs.writeFileSync(outputPath, tsContent, 'utf-8');
    
    console.log('✅ Figma variables compiled to CSS and saved to src/lib/figma-variables.css.ts');
    console.log(`📊 CSS size: ${(cssContent.length / 1024).toFixed(2)}KB`);
    
  } catch (error) {
    console.error('❌ Error compiling Figma CSS:', error);
  }
}

compileFigmaCSS();